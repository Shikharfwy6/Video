# वीडियो एडिटिंग टिप्स – Remotion explainer (1080x1920, 30fps, ~70s)

## Chalane ke steps
```bash
npm install
npm run studio     # preview (browser mein)
npm run build      # out/video.mp4 banata hai
```

## Kya-kya hai
- `public/voiceover.mp3` – tumhari voiceover
- `src/timing.json` – voiceover se nikala hua timing + lip-sync data (`npm run timing` se dobara bante hai)
- `src/Character.tsx` – "बंटी" character; mooh voiceover ki awaaz ke hisaab se khulta hai, aankhein jhapakti hain, haath section ke hisaab se badalta hai
- `src/Captions.tsx` – Devanagari captions, bolte hue shabd highlight hote hain
- `src/scenes/*` – har tip ka alag explainer animation

## Timing theek karna
Captions ka word-timing andaaza hai (voiceover mein pauses dhoondh kar). Agar koi shabd aage-peeche lage,
`scripts/make_timing.py` mein `SECTIONS` ka text voiceover ke bilkul same shabdon se badal do aur `npm run timing` chalao.
Font: Baloo 2 (Google Fonts) – pehli baar render par internet chahiye.

## GitHub par render karna
1. Is folder ko GitHub repo mein push karo (branch `main`).
2. Repo > Actions > "Render video" > Run workflow (ya push par apne-aap chalega).
3. Khatam hone par run ke andar **Artifacts > video** se `video.mp4` download karo.
