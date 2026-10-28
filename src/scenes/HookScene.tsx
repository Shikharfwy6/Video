import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {pop, seg} from '../util';

const CARDS = ['#FF4F81', '#7CE3C3', '#FFC233', '#8E7CFF', '#FF8A4F', '#4FC3FF'];
const PILLS = ['हुक', 'डेड एयर', 'कैप्शन', 'वर्टिकल', 'AI'];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const phase2 = seg(t, 3.2, 3.9); // phone leaves, "5" arrives
  const ring = Math.min(t / 2, 1);
  const count = Math.max(0, Math.ceil(2 - t));
  const R = 118, circ = 2 * Math.PI * R;
  const shake = t > 2 && t < 3.2 ? Math.sin(t * 60) * 6 : 0;
  const scroll = (t * 1100) % 270;

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      {/* phone with fast-scrolling feed */}
      <div style={{position: 'absolute', left: 90 - phase2 * 700, top: 70, width: 340, height: 640, borderRadius: 48, border: `8px solid ${C.paper}`, overflow: 'hidden', background: C.deep, opacity: 1 - phase2}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: -270 + scroll}}>
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} style={{margin: '0 20px 20px', height: 250, borderRadius: 28, background: CARDS[i % CARDS.length]}} />
          ))}
        </div>
      </div>

      {/* 2-second countdown */}
      <div style={{position: 'absolute', left: 520 + phase2 * 700, top: 150, width: 300, height: 300, opacity: 1 - phase2}}>
        <svg width={300} height={300} viewBox="0 0 300 300" style={{transform: `translateX(${shake}px)`}}>
          <circle cx={150} cy={150} r={R} stroke="rgba(255,248,236,0.18)" strokeWidth={22} fill="none" />
          <circle cx={150} cy={150} r={R} stroke={t > 2 ? C.pink : C.marigold} strokeWidth={22} fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * ring} transform="rotate(-90 150 150)" />
          <text x={150} y={205} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={170} fill={C.paper}>{count}</text>
        </svg>
        <div style={{textAlign: 'center', color: t > 2 ? C.pink : C.paper, fontSize: 56, fontWeight: 800, marginTop: 6}}>
          {t > 2 ? 'स्क्रॉल!' : 'सेकंड'}
        </div>
      </div>

      {/* the 5 things */}
      <div style={{position: 'absolute', left: 70, top: 130, fontSize: 420, fontWeight: 800, color: C.marigold, lineHeight: 1,
        opacity: phase2, transform: `scale(${0.6 + 0.4 * pop(t, 3.4)})`}}>5</div>
      <div style={{position: 'absolute', left: 80, top: 560, fontSize: 64, fontWeight: 800, color: C.paper, opacity: phase2}}>चीज़ें</div>
      <div style={{position: 'absolute', left: 430, top: 100, width: 520}}>
        {PILLS.map((p, i) => {
          const s = pop(t, 4.0 + i * 0.55);
          return (
            <div key={p} style={{margin: '0 0 22px', padding: '12px 34px', borderRadius: 40, fontSize: 60, fontWeight: 800,
              background: i % 2 ? C.mint : C.pink, color: C.deep, width: 'fit-content',
              opacity: Math.min(1, s), transform: `translateX(${(1 - Math.min(1, s)) * 120}px) scale(${Math.max(0.01, s)})`, transformOrigin: 'left center'}}>
              {p}
            </div>
          );
        })}
      </div>
    </div>
  );
};
