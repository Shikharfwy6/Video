import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Cross, Check, Star} from '../icons';
import {lerp, pop, seg} from '../util';

const W = 170, STEP = 184;

export const Tip1Scene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const p1 = seg(t, 3.4, 5.4);   // star jumps to the front
  const p2 = seg(t, 7.6, 9.0);   // old intro is deleted

  // [initial slot, slot after move, final slot]
  const clips = [
    {k: 'intro', label: 'इंट्रो', bg: C.pink, s: [0, 1, 1]},
    {k: 'b1', label: 'बात 1', bg: C.grey, s: [1, 2, 1]},
    {k: 'b2', label: 'बात 2', bg: C.grey, s: [2, 3, 2]},
    {k: 'b3', label: 'बात 3', bg: C.grey, s: [3, 4, 3]},
    {k: 'star', label: 'धमाका', bg: C.marigold, s: [4, 0, 0]},
  ];

  const bad = t < 3.2;
  const removed = t > 7.4;

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 68, fontWeight: 800,
        color: bad ? C.pink : C.mint, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
        {bad ? <><Cross size={64} /> इंट्रो पहले</> : <><Check size={64} /> हुक पहले</>}
      </div>

      {/* "first 2 seconds" bracket over slot 0 */}
      <div style={{position: 'absolute', left: 47 - 8, top: 240, width: W + 16, height: 300, borderRadius: 30,
        border: `6px dashed ${C.mint}`, opacity: p1}} />
      <div style={{position: 'absolute', left: 47 - 40, top: 190, width: W + 80, textAlign: 'center', fontSize: 40, fontWeight: 700, color: C.mint, opacity: p1}}>
        पहले 2 सेकंड
      </div>

      {clips.map((c) => {
        const slot = lerp(lerp(c.s[0], c.s[1], p1), c.s[2], p2);
        const lift = c.k === 'star' ? -Math.sin(Math.PI * p1) * 90 : 0;
        const gone = c.k === 'intro' ? p2 : 0;
        const shake = c.k === 'intro' && t > 6.8 && t < 7.8 ? Math.sin(t * 50) * 5 : 0;
        return (
          <div key={c.k} style={{position: 'absolute', left: 47 + slot * STEP + shake, top: 280 + lift, width: W, height: 220,
            borderRadius: 26, background: c.bg, color: C.deep, fontSize: 40, fontWeight: 800,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: 1 - gone, transform: `scale(${1 - gone})`}}>
            {c.k === 'star' && <Star size={64} color={C.deep} />}
            {c.label}
          </div>
        );
      })}

      {/* timeline ruler */}
      <div style={{position: 'absolute', left: 47, top: 560, width: 906, height: 6, borderRadius: 3, background: 'rgba(255,248,236,0.2)'}} />

      {/* the hello-dosto line that gets removed */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', fontSize: 52, fontWeight: 700,
        color: C.paper, opacity: Math.min(1, pop(t, 6.2)) * (removed ? 0.35 : 1)}}>
        <span style={{textDecoration: removed ? 'line-through' : 'none', textDecorationColor: C.pink, textDecorationThickness: 6}}>
          “हेलो दोस्तों, आज हम…”
        </span>
      </div>
    </div>
  );
};
