"""Punch-in zoom voiceover (public/voice_punchin.mp3) se timing + lip-sync data -> src/timing_punchin.json
Chalane ke liye: python3 scripts/make_timing_punchin.py   (ffmpeg, numpy, scipy chahiye)

Voiceover mein jo bhi sentences hain wo `SECTIONS` ke text se match hone chahiye.
Har section = ek scene. Har section ke andar sentences alag list mein hain.
"""
import json, re, subprocess, numpy as np
from scipy.io import wavfile

FPS = 30
MP3 = "public/voice_punchin.mp3"

SECTIONS = [
  ("hook", ["तुम्हारी वीडियो बोरिंग इसलिए लगती है, क्योंकि स्क्रीन पर कुछ बदलता ही नहीं।"]),
  ("title", ["इसका सबसे आसान इलाज है, पंच-इन ज़ूम।"]),
  ("how", ["इसमें करना बस इतना है।",
           "जब तुम बोलते हो, तो हर नए वाक्य पर क्लिप को थोड़ा सा बड़ा कर दो।"]),
  ("alt", ["पहला वाक्य नॉर्मल रखो।", "दूसरे वाक्य पर क्लिप को हल्का सा ज़ूम कर दो।",
           "तीसरे पर वापस नॉर्मल।", "ऐसे बारी-बारी से करते जाओ।"]),
  ("why", ["इससे दर्शक को हर बार लगता है कि कुछ नया आया।",
           "उसका ध्यान टूटता नहीं, और वो आगे देखता रहता है।"]),
  ("amt", ["ज़ूम कितना रखना है?", "सिर्फ़ दस से पंद्रह प्रतिशत।",
           "इससे ज़्यादा किया, तो वीडियो धुंधली दिखने लगेगी।"]),
  ("mistake", ["और एक गलती मत करना।", "हर वाक्य पर ज़ूम मत लगाओ।",
               "बारी-बारी से लगाओ, वरना वीडियो हिलती हुई लगेगी।"]),
  ("cta", ["अगली बार एडिट करो, तो ये ज़रूर आज़माना।", "और बताना, फ़र्क़ दिखा या नहीं।"]),
]

def weight(w):
    return len(re.sub(r"[^\w]", "", w)) + 1 + (2 if re.search(r"[।,?!.]", w) else 0)

# ---- silences
out = subprocess.run(["ffmpeg","-hide_banner","-i",MP3,"-af","silencedetect=noise=-35dB:d=0.3","-f","null","-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
ends   = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out)
dur = int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
sil = list(zip(starts, ends[:len(starts)]))

spans, t = [], 0.0
for s, e in sil:
    if s - t > 0.05: spans.append((t, s))
    t = e
if dur - t > 0.05: spans.append((t, dur))

def map_fraction(frac, sp):
    total = sum(e - s for s, e in sp)
    x = frac * total
    for s, e in sp:
        if x <= e - s: return s + x
        x -= e - s
    return sp[-1][1]

# ---- predict section boundaries from text length, then snap to the nearest real pause
all_words = [w for _, sents in SECTIONS for sn in sents for w in sn.split()]
tot_w = sum(weight(w) for w in all_words)
bounds, acc = [0.0], 0
pause_mid = [(a + b) / 2 for a, b in sil]
for _, sents in SECTIONS[:-1]:
    acc += sum(weight(w) for sn in sents for w in sn.split())
    guess = map_fraction(acc / tot_w, spans)
    near = [p for p in pause_mid if abs(p - guess) < 1.3 and p > bounds[-1] + 1.0]
    bounds.append(min(near, key=lambda p: abs(p - guess)) if near else guess)
bounds.append(dur)

# ---- words + sentence beats inside each section
sections = []
for i, (key, sents) in enumerate(SECTIONS):
    a, b = bounds[i], bounds[i+1]
    sp = [(max(s, a), min(e, b)) for s, e in spans if e > a and s < b]
    sp = [(s, e) for s, e in sp if e - s > 0.02]
    ws, sent_first = [], []
    for sn in sents:
        sent_first.append(len(ws)); ws += sn.split()
    wts = [weight(w) for w in ws]
    cum = np.concatenate([[0], np.cumsum(wts)]) / sum(wts)
    words = [{"t": w, "s": round(map_fraction(cum[k], sp), 3), "e": round(map_fraction(cum[k+1], sp), 3)} for k, w in enumerate(ws)]
    beats = [round(words[k]["s"] - a, 3) for k in sent_first]
    sections.append({"key": key, "start": round(a, 3), "end": round(b, 3),
                     "speechStart": round(sp[0][0], 3), "speechEnd": round(sp[-1][1], 3),
                     "words": words, "beats": beats})

# ---- lip-sync envelope
subprocess.run(["ffmpeg","-y","-loglevel","error","-i",MP3,"-ac","1","-ar","16000","/tmp/vo2.wav"], check=True)
sr, x = wavfile.read("/tmp/vo2.wav"); x = x.astype(np.float32); x /= (np.abs(x).max() or 1)
nfr = int(np.ceil(dur * FPS)); win = sr // FPS
rms = np.array([np.sqrt(np.mean(x[max(0, int(i*sr/FPS)-win//2): int(i*sr/FPS)+win//2]**2) + 1e-9) for i in range(nfr)])
ref = np.percentile(rms, 92)
env = np.clip(rms / ref, 0, 1) ** 0.8
env[env < 0.08] = 0
sm, v = [], 0.0
for e in env:
    v = v + (e - v) * (0.7 if e > v else 0.35)
    sm.append(round(float(v), 3))

json.dump({"fps": FPS, "duration": round(dur, 3), "frames": nfr, "sections": sections, "envelope": sm},
          open("src/timing_punchin.json", "w"), ensure_ascii=False)
print("duration", dur, "frames", nfr)
for s in sections:
    print(f'{s["key"]:8} {s["start"]:6.2f} -> {s["end"]:6.2f} | beats {s["beats"]}')
