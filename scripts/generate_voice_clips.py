"""Record read-aloud clips for every text in scripts/speech-texts.json, using
the same Microsoft neural voices as the intro videos.

    pip install edge-tts
    python scripts/generate_voice_clips.py

Writes public/tts/<lang>/<key>.mp3 and src/data/voiceClips.json (the list of
available keys). Existing clips are kept, so re-runs only record new text.
Clips whose text no longer appears on the site are deleted.

clip_key() and normalize() MUST match src/services/voiceClips.js.
"""
import asyncio
import json
import os
import re
import sys

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = {
    'en': 'en-GB-SoniaNeural',  # English intro video voice
    'ur': 'ur-IN-GulNeural',    # Urdu intro video voice
}
RATE = '-6%'  # a little slower than default, easier for young listeners
CONCURRENCY = 4


def normalize(text):
    return re.sub(r'\s+', ' ', str(text)).strip()


def clip_key(lang, text):
    data = f'{lang}|{normalize(text)}'.encode('utf-8')
    h = 0x811C9DC5
    for b in data:
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f'{h:08x}{len(data):x}'


async def record(lang, text, path, sem):
    async with sem:
        for attempt in range(4):
            try:
                tmp = path + '.part'
                await edge_tts.Communicate(normalize(text), VOICES[lang], rate=RATE).save(tmp)
                if os.path.getsize(tmp) < 1000:
                    raise RuntimeError('empty audio')
                os.replace(tmp, path)
                return True
            except Exception as error:  # network hiccups: retry with backoff
                if attempt == 3:
                    print(f'  FAILED [{lang}] {normalize(text)[:70]!r}: {error}', file=sys.stderr)
                    if os.path.exists(path + '.part'):
                        os.remove(path + '.part')
                    return False
                await asyncio.sleep(1.5 * (attempt + 1))


async def main():
    with open(os.path.join(ROOT, 'scripts', 'speech-texts.json'), encoding='utf-8') as f:
        texts = json.load(f)

    sem = asyncio.Semaphore(CONCURRENCY)
    manifest = {}
    for lang in ('en', 'ur'):
        out_dir = os.path.join(ROOT, 'public', 'tts', lang)
        os.makedirs(out_dir, exist_ok=True)
        wanted = {clip_key(lang, t): t for t in texts.get(lang, [])}

        for name in os.listdir(out_dir):
            if name.endswith('.mp3') and name[:-4] not in wanted:
                os.remove(os.path.join(out_dir, name))

        todo = [(k, t) for k, t in wanted.items() if not os.path.exists(os.path.join(out_dir, f'{k}.mp3'))]
        print(f'{lang}: {len(wanted)} texts, {len(todo)} to record with {VOICES[lang]}')
        await asyncio.gather(*(record(lang, t, os.path.join(out_dir, f'{k}.mp3'), sem) for k, t in todo))
        manifest[lang] = sorted(k for k in wanted if os.path.exists(os.path.join(out_dir, f'{k}.mp3')))
        print(f'{lang}: {len(manifest[lang])} clips available')

    with open(os.path.join(ROOT, 'src', 'data', 'voiceClips.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, separators=(',', ':'))
        f.write('\n')


if __name__ == '__main__':
    asyncio.run(main())
