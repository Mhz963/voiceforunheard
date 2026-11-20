# Read-aloud voice clips

The site's "Listen" buttons play pre-recorded clips in the same Microsoft
neural voices as the intro videos:

| Language | Voice |
|----------|-------|
| English  | `en-GB-SoniaNeural` |
| Urdu     | `ur-IN-GulNeural` (can pronounce "وائس فار اناہیرڈ"; `ur-PK-UzmaNeural` cannot) |

Clips live in `public/tts/<lang>/<key>.mp3`; `src/data/voiceClips.json` lists
which exist. Text without a clip (e.g. what someone types) falls back to the
browser's own voice.

## After changing any site text

1. Collect the texts: run `npm run dev`, then in the browser console run
   `localStorage.setItem('vfu_collect_speech', '1')` and visit every page in
   English and in Urdu (switch language and repeat). Texts are merged into
   `scripts/speech-texts.json`. Remove the flag afterwards:
   `localStorage.removeItem('vfu_collect_speech')`.
2. Record the clips:

   ```bash
   pip install edge-tts
   python scripts/generate_voice_clips.py
   ```

   Only new texts are recorded; clips for texts no longer listed are deleted.
3. Commit `public/tts/`, `src/data/voiceClips.json` and `scripts/speech-texts.json`.
