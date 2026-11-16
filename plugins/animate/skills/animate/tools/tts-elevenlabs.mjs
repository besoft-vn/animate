#!/usr/bin/env node
// Voice takes from the ElevenLabs API, for sessions without the ElevenLabs connector (e.g. a scheduled cloud run).
// The key: the environment variable ELEVENLABS_API_KEY if set; otherwise none is sent and the request relies on a
// network secret (a proxy that adds the key to requests for api.elevenlabs.io, as in Claude Code cloud environments).
// Never put the key in the script or the chat.
//   node tools/tts-elevenlabs.mjs voices [--lang vi] [--search "narrator"]     list candidate narrators (your voices + the shared library)
//   node tools/tts-elevenlabs.mjs sample pieces/<name> <voice_id>[,<voice_id>...] [--line open]
//                                         one take of one line per voice -> voice/samples/<voice_id>.mp3 (to pick a narrator)
//   node tools/tts-elevenlabs.mjs lines pieces/<name> [--voice <id>] [--model eleven_multilingual_v2] [--only id1,id2] [--force]
//                                         one take per script line -> voice/<id>.mp3, sets "file" on each line
// voice and model default to script.json "tts": { "voice": "...", "model": "...", "settings": {...} }; the language to "lang".
// Prints the character count (≈ credits) before generating. Then run tools/voice.mjs to place and time the takes.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
// behind an HTTPS proxy (cloud sessions, where a network secret adds the key), Node's fetch must be told to use it
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status ?? 1);
}

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const KEY = process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;
const API = 'https://api.elevenlabs.io';

async function api(p, init = {}) {
  const r = await fetch(API + p, { ...init, headers: { ...(KEY ? { 'xi-api-key': KEY } : {}), 'content-type': 'application/json', ...(init.headers || {}) } });
  if (!r.ok) { const t = await r.text(); throw new Error(`${r.status} ${p}: ${t.slice(0, 400)}${r.status === 401 && !KEY ? ' (no ELEVENLABS_API_KEY and no network secret for api.elevenlabs.io)' : ''}`); }
  return r;
}

async function tts(voice, model, text, lang, settings, ctx = {}) {
  const body = { text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true, ...(settings || {}) } };
  if (lang && /2_5|v3/.test(model)) body.language_code = lang;           // only the newer models take a language code
  if (!/v3/.test(model)) {                                               // continuity across takes (eleven_v3 refuses it)
    if (ctx.prev) body.previous_text = ctx.prev;
    if (ctx.next) body.next_text = ctx.next;
  }
  const r = await api(`/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, { method: 'POST', body: JSON.stringify(body) });
  return Buffer.from(await r.arrayBuffer());
}

const cmd = argv[0];
if (cmd === 'voices') {
  const lang = opt('--lang', 'vi'), q = opt('--search', '');
  const mine = await (await api(`/v2/voices?page_size=100${q ? `&search=${encodeURIComponent(q)}` : ''}`)).json();
  console.log('your voices:');
  for (const v of mine.voices || []) console.log(`  ${v.voice_id}  ${v.name}  [${v.category}] ${JSON.stringify(v.labels || {})}`);
  const shared = await (await api(`/v1/shared-voices?page_size=30&language=${lang}${q ? `&search=${encodeURIComponent(q)}` : ''}`)).json();
  console.log(`shared library (${lang}):`);
  for (const v of shared.voices || []) console.log(`  ${v.voice_id}  ${v.name}  ${v.gender || ''} ${v.age || ''} ${v.accent || ''} ${v.use_case || ''}  "${(v.description || '').slice(0, 80)}"  (public_owner_id ${v.public_owner_id})`);
  console.log('shared voices must be added to your library before use: POST /v1/voices/add/{public_owner_id}/{voice_id} (or in the ElevenLabs app)');
  process.exit(0);
}

const ROOT = path.resolve(argv[1] || '.'), VDIR = path.join(ROOT, 'voice'), SP = path.join(VDIR, 'script.json');
const S = JSON.parse(fs.readFileSync(SP, 'utf8'));
const lang = S.lang || opt('--lang', 'vi'), model = opt('--model', S.tts?.model || 'eleven_multilingual_v2');

if (cmd === 'sample') {
  const ids = (argv[2] || '').split(',').filter(Boolean), L = S.lines.find((l) => l.id === opt('--line', S.lines[0].id));
  console.log(`sample: ${ids.length} voices × ${L.text.length} chars = ${ids.length * L.text.length} characters`);
  fs.mkdirSync(path.join(VDIR, 'samples'), { recursive: true });
  for (const v of ids) { fs.writeFileSync(path.join(VDIR, 'samples', `${v}.mp3`), await tts(v, model, L.text, lang, S.tts?.settings)); console.log('  wrote voice/samples/' + v + '.mp3'); }
} else if (cmd === 'lines') {
  const voice = opt('--voice', S.tts?.voice); if (!voice) { console.error('no voice: pass --voice <id> or set script.json tts.voice'); process.exit(2); }
  const only = opt('--only', '').split(',').filter(Boolean), force = argv.includes('--force');
  const todo = S.lines.filter((l) => (only.length ? only.includes(l.id) : force || !l.file || !fs.existsSync(path.join(VDIR, l.file))));
  const chars = todo.reduce((a, l) => a + l.text.length, 0);
  console.log(`lines: ${todo.length} takes, ${chars} characters (≈ ${chars} credits), voice ${voice}, model ${model}, lang ${lang}`);
  const one = async (l) => {   // up to 3 at a time (the plan's concurrency); retry a take once on 429
    const i = S.lines.indexOf(l);
    for (let k = 0; ; k++) {
      try {
        const buf = await tts(voice, model, l.text, lang, S.tts?.settings, { prev: S.lines[i - 1]?.text, next: S.lines[i + 1]?.text });
        l.file = `${l.id}.mp3`; fs.writeFileSync(path.join(VDIR, l.file), buf); console.log(`  ${l.id}: ${buf.length} bytes`); return;
      } catch (e) { if (k < 2 && /^429/.test(e.message)) { await new Promise((r) => setTimeout(r, 4000)); continue; } throw e; }
    }
  };
  const queue = [...todo]; await Promise.all(Array.from({ length: Math.min(3, queue.length) }, async () => { while (queue.length) await one(queue.shift()); }));
  S.tts = { ...(S.tts || {}), voice, model };
  fs.writeFileSync(SP, JSON.stringify(S, null, 1));
  console.log('updated script.json; next: node tools/voice.mjs ' + path.relative(process.cwd(), ROOT));
} else { console.error('usage: tts-elevenlabs.mjs voices | sample <piece> <ids> | lines <piece>'); process.exit(2); }
