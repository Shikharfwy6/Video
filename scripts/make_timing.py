"""Voiceover se timing + lip-sync envelope nikalta hai -> src/timing.json
Chalane ke liye: python3 scripts/make_timing.py   (ffmpeg chahiye)
"""
import json, re, subprocess, numpy as np
from scipy.io import wavfile

FPS = 30
MP3 = "public/voiceover.mp3"

SECTIONS = [
  ("hook", "आपकी वीडियो के पहले 2 सेकंड में ही लोग स्क्रॉल कर देते हैं। अगर एडिटिंग में ये 5 चीज़ें नहीं हैं, तो व्यूज़ कभी नहीं आएंगे!"),
  ("tip1", "टिप 1: पहले हुक, फिर इंट्रो। सबसे मज़ेदार या चौंकाने वाला पल वीडियो की शुरुआत में लगाओ। 'हेलो दोस्तों, आज हम...' वाला इंट्रो हटा दो।"),
  ("tip2", "टिप 2: डेड एयर काट दो। हर पॉज़, 'उम्म' और फ़ालतू गैप डिलीट करो। पेसिंग तेज़ रखो। शॉर्ट वीडियो में खाली जगह सबसे बड़ी दुश्मन है।"),
  ("tip3", "टिप 3: कैप्शन ज़रूर लगाओ। ज़्यादातर लोग बिना आवाज़ के वीडियो देखते हैं। कैप्शन छोटे, बड़े और पढ़ने में आसान रखो।"),
  ("tip4", "टिप 4: वर्टिकल सोचो। वीडियो 9:16 में ही एडिट करो। हॉरिज़ॉन्टल फ़ुटेज को सिर्फ़ क्रॉप मत करो, फ़्रेमिंग सही से सेट करो।"),
  ("tip5", "टिप 5: AI इस्तेमाल करो, पर ओवर-एडिट मत करो। कैप्शन और कट्स के लिए CapCut या Descript जैसे AI टूल्स यूज़ करो। लेकिन ज़्यादा पॉलिश से वीडियो नकली लगता है। असली अंदाज़ ही जीतता है।"),
  ("cta", "ऐसे और टिप्स चाहिए? फ़ॉलो करो, और वीडियो का अंत ऐसा रखो कि वो दोबारा चल पड़े!"),
]

# ---- 1. silences
out = subprocess.run(["ffmpeg","-hide_banner","-i",MP3,"-af","silencedetect=noise=-35dB:d=0.3","-f","null","-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
ends   = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out)
dur = int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
sil = list(zip(starts, ends[:len(starts)]))

# ---- 2. speech spans
spans, t = [], 0.0
for s, e in sil:
    if s - t > 0.05: spans.append((t, s))
    t = e
if dur - t > 0.05: spans.append((t, dur))

# ---- 3. section split = biggest (N-1) pauses
N = len(SECTIONS)
big = sorted(sorted(sil, key=lambda p: p[1]-p[0], reverse=True)[:N-1])
cuts = [(a+b)/2 for a, b in big]
bounds = [0.0] + cuts + [dur]

# ---- 4. words timed on silence-free speech timeline
def words_of(text):
    return [w for w in re.split(r"\s+", text.strip()) if w]

sections = []
for i, (key, text) in enumerate(SECTIONS):
    a, b = bounds[i], bounds[i+1]
    sp = [(max(s, a), min(e, b)) for s, e in spans if e > a and s < b]
    sp = [(s, e) for s, e in sp if e - s > 0.02]
    total = sum(e - s for s, e in sp)
    ws = words_of(text)
    weights = [len(re.sub(r"[^\w]", "", w)) + 1 + (2 if re.search(r"[।,?!.]", w) else 0) for w in ws]
    cum = np.concatenate([[0], np.cumsum(weights)]) / sum(weights)
    def to_real(frac, sp=sp, total=total):
        x = frac * total
        for s, e in sp:
            if x <= e - s: return s + x
            x -= e - s
        return sp[-1][1]
    words = [{"t": w, "s": round(to_real(cum[k]), 3), "e": round(to_real(cum[k+1]), 3)} for k, w in enumerate(ws)]
    sections.append({"key": key, "start": round(a, 3), "end": round(b, 3),
                     "speechStart": round(sp[0][0], 3), "speechEnd": round(sp[-1][1], 3), "words": words})

# ---- 5. lip-sync envelope @ FPS
subprocess.run(["ffmpeg","-y","-loglevel","error","-i",MP3,"-ac","1","-ar","16000","/tmp/vo.wav"], check=True)
sr, x = wavfile.read("/tmp/vo.wav"); x = x.astype(np.float32); x /= (np.abs(x).max() or 1)
nfr = int(np.ceil(dur * FPS)); win = sr // FPS
rms = np.array([np.sqrt(np.mean(x[max(0, int(i*sr/FPS)-win//2): int(i*sr/FPS)+win//2]**2) + 1e-9) for i in range(nfr)])
ref = np.percentile(rms, 92)
env = np.clip(rms / ref, 0, 1) ** 0.8
env[env < 0.08] = 0
sm, v = [], 0.0
for e in env:                       # attack tez, release halka
    v = v + (e - v) * (0.7 if e > v else 0.35)
    sm.append(round(float(v), 3))

json.dump({"fps": FPS, "duration": round(dur, 3), "frames": nfr, "sections": sections, "envelope": sm},
          open("src/timing.json", "w"), ensure_ascii=False)
print("duration", dur, "frames", nfr)
for s in sections: print(s["key"], s["start"], "->", s["end"], "| speech", s["speechStart"], "-", s["speechEnd"], "| words", len(s["words"]))
