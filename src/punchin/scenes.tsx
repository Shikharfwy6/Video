import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Check, Cross, Star} from '../icons';
import {clamp01, lerp, pop, seg} from '../util';

export type SP = {beats: number[]; dur: number};

/* ---------- shared "video clip" mock: zoomable ---------- */
const Clip: React.FC<{
  w: number; h: number; scale?: number; blur?: number; dx?: number; dy?: number; frame?: string; gray?: number;
}> = ({w, h, scale = 1, blur = 0, dx = 0, dy = 0, frame = C.paper, gray = 0}) => (
  <div style={{width: w, height: h, borderRadius: 28, overflow: 'hidden', position: 'relative', boxSizing: 'border-box',
    border: `6px solid ${frame}`, background: '#24497A'}}>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 42%',
      transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
      filter: `blur(${blur}px) grayscale(${gray})`}}>
      <svg width="100%" height="100%" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice">
        <rect width={200} height={240} fill="#24497A" />
        <circle cx={160} cy={40} r={26} fill="#3A6AA8" />
        <path d="M24 240 C24 150 176 150 176 240 Z" fill={C.marigold} />
        <rect x={86} y={118} width={28} height={30} rx={12} fill="#D89560" />
        <ellipse cx={100} cy={92} rx={34} ry={38} fill={C.skin} />
        <path d="M66 86 C64 50 90 44 100 44 C120 44 138 56 134 86 C128 66 112 62 100 62 C86 62 72 70 66 86 Z" fill="#1E1A24" />
        <circle cx={88} cy={92} r={3.6} fill="#1B1B2F" />
        <circle cx={112} cy={92} r={3.6} fill="#1B1B2F" />
        <path d="M90 108 Q100 116 110 108" stroke="#7A2E3A" strokeWidth={3} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const Pop: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{opacity: Math.min(1, p), transform: `scale(${Math.max(0.01, p)})`, ...style}}>{children}</div>
);

const Label: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.paper, size = 54, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, ...style}}>{children}</div>
);

const useT = () => useCurrentFrame() / 30;

/* ---------- 1. hook ---------- */
export const SHook: React.FC<SP> = ({dur}) => {
  const t = useT();
  const gray = 0.8 * clamp01(t / dur);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 240, top: 40}}>
        <Clip w={520} h={520} gray={gray} />
      </div>
      <svg style={{position: 'absolute', left: 60, top: 600}} width={880} height={120}>
        <path d="M0 70 H880" stroke={C.pink} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={880} strokeDashoffset={880 * (1 - seg(t, 0.6, 2.4))} />
      </svg>
      <Label color={C.pink} size={50} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: seg(t, 1.8, 2.5)}}>
        कुछ भी नहीं बदल रहा
      </Label>
      <Pop p={pop(t, 2.6)} style={{position: 'absolute', left: 560, top: 70, transform: `rotate(-9deg) scale(${Math.max(0.01, pop(t, 2.6))})`}}>
        <div style={{background: C.pink, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 96, padding: '0 30px', borderRadius: 24}}>बोरिंग</div>
      </Pop>
    </div>
  );
};

/* ---------- 2. title ---------- */
export const STitle: React.FC<SP> = () => {
  const t = useT();
  const z = 1 + 0.15 * (0.5 - 0.5 * Math.cos(Math.max(0, t - 1.2) * 4));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Pop p={pop(t, 0.35)} style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center'}}>
        <Label color={C.paper} size={52}>सबसे आसान इलाज</Label>
      </Pop>
      <Pop p={pop(t, 0.9)} style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center'}}>
        <Label color={C.marigold} size={150}>पंच-इन ज़ूम</Label>
      </Pop>
      <div style={{position: 'absolute', left: 330, top: 380, opacity: seg(t, 1.2, 1.8)}}>
        <Clip w={340} h={340} scale={z} frame={C.marigold} />
      </div>
    </div>
  );
};

/* ---------- 3. how ---------- */
export const SHow: React.FC<SP> = ({beats}) => {
  const t = useT();
  const [b0, b1] = beats;
  const scale = 1 + 0.14 * seg(t, b1 + 0.9, b1 + 1.6);
  const arrow = seg(t, b1 + 1.3, b1 + 1.9);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 60, top: 90}}>
        <Clip w={480} h={580} scale={scale} frame={scale > 1.02 ? C.marigold : C.paper} />
      </div>
      <Pop p={pop(t, b0 + 0.2)} style={{position: 'absolute', left: 600, top: 150, transformOrigin: 'left center'}}>
        <Label color={C.mint} size={58}>बस इतना करना है</Label>
      </Pop>
      <Pop p={pop(t, b1 + 0.2)} style={{position: 'absolute', left: 600, top: 300, transformOrigin: 'left center'}}>
        <Label size={58}>हर नए वाक्य पर</Label>
      </Pop>
      <Pop p={pop(t, b1 + 1.2)} style={{position: 'absolute', left: 600, top: 440, transformOrigin: 'left center'}}>
        <Label color={C.marigold} size={62}>क्लिप थोड़ी बड़ी</Label>
      </Pop>
      <svg style={{position: 'absolute', left: 640, top: 540, opacity: arrow}} width={120} height={140} viewBox="0 0 120 140">
        <path d="M60 130 V20 M20 60 L60 18 L100 60" stroke={C.marigold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
};

/* ---------- 4. alternate normal / zoom / normal ---------- */
export const SAlt: React.FC<SP> = ({beats, dur}) => {
  const t = useT();
  const [b0, b1, b2, b3] = beats;
  const items = [
    {x: 50, b: b0, zoom: 0, label: 'वाक्य 1 · नॉर्मल', col: C.paper},
    {x: 355, b: b1, zoom: seg(t, b1 + 0.5, b1 + 1.1), label: 'वाक्य 2 · ज़ूम', col: C.marigold},
    {x: 660, b: b2, zoom: 0, label: 'वाक्य 3 · नॉर्मल', col: C.paper},
  ];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {items.map((it) => (
        <div key={it.x} style={{position: 'absolute', left: it.x, top: 70}}>
          <Pop p={pop(t, it.b)}>
            <Clip w={290} h={400} scale={1 + 0.15 * it.zoom} frame={it.zoom > 0.5 ? C.marigold : C.paper} />
            <Label color={it.col} size={38} style={{textAlign: 'center', marginTop: 14}}>{it.label}</Label>
          </Pop>
        </div>
      ))}
      <div style={{position: 'absolute', left: 50, right: 50, top: 600, display: 'flex', gap: 14, justifyContent: 'center'}}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const lit = pop(t, b3 + i * Math.min(0.5, (dur - b3 - 0.3) / 6));
          const z = i % 2 === 1;
          return (
            <div key={i} style={{width: 138, height: 84, borderRadius: 20, background: z ? C.marigold : C.grey, color: C.deep,
              fontFamily: FONT, fontWeight: 800, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: Math.min(1, lit), transform: `scale(${Math.max(0.01, lit)})`}}>
              {z ? 'ज़ूम' : 'नॉर्मल'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- 5. why it works: attention graph ---------- */
const path = (fn: (x: number) => number) => {
  let d = '';
  for (let x = 0; x <= 800; x += 8) d += `${x === 0 ? 'M' : 'L'}${40 + x} ${360 - fn(x) * 320} `;
  return d;
};
const BUMPS = [120, 260, 400, 540, 680];
const pinkFn = (x: number) => 0.12 + 0.82 * Math.exp(-x / 200);
const mintFn = (x: number) => 0.78 - 0.05 * (x / 800) + BUMPS.reduce((s, b) => s + 0.16 * Math.exp(-Math.pow((x - b) / 16, 2)), 0);

export const SWhy: React.FC<SP> = ({beats}) => {
  const t = useT();
  const [b0, b1] = beats;
  const pinkP = seg(t, 0.1, b0 + 1.2);
  const mintP = seg(t, b0 + 1.2, b1 + 1.8);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg style={{position: 'absolute', left: 60, top: 110}} width={880} height={420} viewBox="0 0 880 420">
        <path d="M40 40 V365 H840" stroke="rgba(255,248,236,0.4)" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={path(pinkFn)} pathLength={1} stroke={C.pink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={1} strokeDashoffset={1 - pinkP} />
        <path d={path(mintFn)} pathLength={1} stroke={C.mint} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={1} strokeDashoffset={1 - mintP} />
        {BUMPS.map((b, i) => (
          <circle key={b} cx={40 + b} cy={360 - mintFn(b) * 320} r={13} fill={C.marigold} opacity={seg(t, b0 + 1.2 + i * 0.5, b0 + 1.5 + i * 0.5)} />
        ))}
      </svg>
      <Label size={40} color={C.grey} style={{position: 'absolute', left: 80, top: 70}}>ध्यान</Label>
      <Label size={40} color={C.grey} style={{position: 'absolute', right: 70, top: 540}}>समय</Label>
      <Label size={46} color={C.pink} style={{position: 'absolute', left: 120, top: 620, opacity: pinkP}}>बिना ज़ूम</Label>
      <Label size={46} color={C.mint} style={{position: 'absolute', right: 110, top: 620, opacity: mintP}}>ज़ूम के साथ</Label>
    </div>
  );
};

/* ---------- 6. how much zoom ---------- */
export const SAmt: React.FC<SP> = ({beats}) => {
  const t = useT();
  const [b0, b1, b2] = beats;
  const search = (tt: number) => 20 + 16 * Math.sin((tt - b0) * 3.2);
  let val: number;
  if (t < b1) val = search(t);
  else if (t < b2) val = lerp(search(b1), 12.5, seg(t, b1, b1 + 0.5));
  else val = lerp(12.5, 36, seg(t, b2 + 0.2, b2 + 1.0));
  const TX = 80, TW = 840;
  const good = val >= 10 && val <= 15;
  const bad = val > 20;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 320, top: 30}}>
        <Clip w={360} h={340} scale={1 + val / 100} blur={Math.max(0, (val - 20) / 5)} frame={bad ? C.pink : good ? C.mint : C.paper} />
      </div>
      <div style={{position: 'absolute', left: TX, top: 450, width: TW, height: 40, borderRadius: 20, overflow: 'hidden', display: 'flex'}}>
        <div style={{width: '25%', background: C.grey}} />
        <div style={{width: '12.5%', background: C.mint}} />
        <div style={{width: '62.5%', background: C.pink}} />
      </div>
      <div style={{position: 'absolute', left: TX + (val / 40) * TW - 34, top: 428, width: 68, height: 84, borderRadius: 34,
        background: C.paper, border: `8px solid ${C.deep}`, boxSizing: 'border-box'}} />
      <Label size={40} color={C.mint} style={{position: 'absolute', left: TX + TW * 0.25 - 40, top: 525, opacity: seg(t, b1 + 0.4, b1 + 0.9)}}>10–15%</Label>
      <Label size={96} color={good ? C.mint : bad ? C.pink : C.paper} style={{position: 'absolute', left: 0, right: 0, top: 580, textAlign: 'center'}}>
        {Math.round(val)}%
      </Label>
      <Label size={46} color={C.pink} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: seg(t, b2 + 0.8, b2 + 1.3)}}>
        ज़्यादा ज़ूम = धुंधली वीडियो
      </Label>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
        opacity: seg(t, b1 + 0.7, b1 + 1.1) * (1 - seg(t, b2, b2 + 0.4))}}>
        <Check size={54} /><Label size={46} color={C.mint}>सही रेंज</Label>
      </div>
    </div>
  );
};

/* ---------- 7. the mistake ---------- */
export const SMistake: React.FC<SP> = ({beats, dur}) => {
  const t = useT();
  const [b0, b1, b2] = beats;
  const mid = b2 + 0.4 * (dur - b2);
  const mode = t < b1 ? 'warn' : t < b2 ? 'all' : t < mid ? 'alt' : 'shake';
  const rowOn = seg(t, b1, b1 + 0.4);
  const jx = mode === 'shake' ? Math.sin(t * 70) * 6 : 0;
  const jy = mode === 'shake' ? Math.cos(t * 83) * 5 : 0;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Pop p={pop(t, b0 + 0.1) * (1 - seg(t, b1 - 0.3, b1))} style={{position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <svg width={360} height={320} viewBox="0 0 120 106">
          <path d="M60 6 L114 100 H6 Z" fill={C.marigold} stroke={C.marigold} strokeWidth={8} strokeLinejoin="round" />
          <rect x={55} y={38} width={10} height={32} rx={5} fill={C.deep} />
          <circle cx={60} cy={82} r={6} fill={C.deep} />
        </svg>
        <Label size={80} color={C.marigold}>एक गलती</Label>
      </Pop>

      {mode !== 'warn' && (
        <div style={{position: 'absolute', left: 40, right: 40, top: 90, display: 'flex', gap: 20, justifyContent: 'center', opacity: rowOn}}>
          {[0, 1, 2, 3].map((i) => {
            const zoomed = mode === 'alt' ? i % 2 === 1 : true;
            const ok = mode === 'alt';
            return (
              <div key={i} style={{position: 'relative'}}>
                <Clip w={215} h={300} scale={zoomed ? 1.16 : 1} dx={i % 2 ? jx : -jx} dy={jy} frame={ok ? C.mint : zoomed ? C.pink : C.paper} />
                <div style={{position: 'absolute', left: 0, right: 0, bottom: -70, display: 'flex', justifyContent: 'center',
                  opacity: seg(t, (mode === 'all' ? b1 : mode === 'alt' ? b2 : mid) + 0.3 + i * 0.25, (mode === 'all' ? b1 : mode === 'alt' ? b2 : mid) + 0.6 + i * 0.25)}}>
                  {ok ? <Check size={56} /> : <Cross size={56} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode !== 'warn' && (
        <Label size={54} color={mode === 'alt' ? C.mint : C.pink} style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center'}}>
          {mode === 'all' ? 'हर वाक्य पर ज़ूम नहीं' : mode === 'alt' ? 'बारी-बारी से लगाओ' : 'वरना वीडियो हिलती दिखेगी'}
        </Label>
      )}
    </div>
  );
};

/* ---------- 8. call to action ---------- */
export const SCta: React.FC<SP> = ({beats}) => {
  const t = useT();
  const [b0, b1] = beats;
  const cyc = (t * 0.8) % 2;
  const zoomOn = cyc > 1;
  const sc = 1 + 0.14 * (zoomOn ? seg(cyc, 1, 1.25) : 1 - seg(cyc, 0, 0.25));
  const bubble = pop(t, b1 + 0.2);
  const follow = pop(t, b1 + 1.4);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 60, top: 110}}>
        <Clip w={420} h={520} scale={sc} frame={zoomOn ? C.marigold : C.paper} />
        <Label size={40} color={zoomOn ? C.marigold : C.paper} style={{textAlign: 'center', marginTop: 14}}>{zoomOn ? 'ज़ूम' : 'नॉर्मल'}</Label>
      </div>
      <Pop p={pop(t, b0 + 0.3)} style={{position: 'absolute', left: 540, top: 130, transformOrigin: 'left center'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: C.mint, color: C.deep, fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: '8px 40px', borderRadius: 50}}>
          <Star size={52} color={C.deep} /> आज़माओ
        </div>
      </Pop>
      <Pop p={bubble} style={{position: 'absolute', left: 520, top: 320, width: 420, transformOrigin: 'left center'}}>
        <div style={{background: C.paper, color: C.deep, fontFamily: FONT, fontWeight: 800, fontSize: 60, padding: '22px 34px', borderRadius: 40, borderBottomLeftRadius: 8, textAlign: 'center'}}>
          फ़र्क़ दिखा?
        </div>
      </Pop>
      <Pop p={follow} style={{position: 'absolute', left: 540, top: 560, transformOrigin: 'left center'}}>
        <div style={{display: 'inline-block', background: C.pink, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 60, padding: '8px 44px', borderRadius: 50}}>
          फ़ॉलो करो
        </div>
      </Pop>
    </div>
  );
};
