import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Scissors} from '../icons';
import {pop, seg} from '../util';

type Item = {gap: boolean; n: number; label?: string};
const ITEMS: Item[] = [
  {gap: false, n: 8}, {gap: true, n: 4, label: 'उम्म'}, {gap: false, n: 10},
  {gap: true, n: 5, label: 'गैप'}, {gap: false, n: 7}, {gap: true, n: 3, label: 'उम्म'}, {gap: false, n: 9},
];
const BAR = 20;
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const Tip2Scene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const cutStart = [5.0, 5.8, 6.6];
  let gi = 0;
  let x = 40, bar = 0;
  const nodes: React.ReactNode[] = [];
  let scissorsX = -100, scissorsOn = false;

  ITEMS.forEach((it, k) => {
    let factor = 1;
    if (it.gap) {
      const p = seg(t, cutStart[gi], cutStart[gi] + 0.7);
      factor = 1 - p;
      if (p > 0 && p < 1) { scissorsX = x; scissorsOn = true; }
      gi++;
    }
    const w = it.n * BAR * factor;
    if (it.gap && factor > 0.02) {
      nodes.push(
        <div key={`g${k}`} style={{position: 'absolute', left: x, top: 230, width: w, height: 250, borderRadius: 18,
          background: 'rgba(255,79,129,0.28)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          opacity: pop(t, 1.0 + k * 0.1)}}>
          <span style={{fontSize: 34, fontWeight: 800, color: C.pink, paddingBottom: 8, whiteSpace: 'nowrap'}}>{it.label}</span>
        </div>
      );
    }
    if (!it.gap) {
      for (let b = 0; b < it.n; b++) {
        const h = 50 + rnd(bar + b) * 170;
        nodes.push(<div key={`b${bar + b}`} style={{position: 'absolute', left: x + b * BAR, top: 355 - h / 2, width: 14, height: h, borderRadius: 7, background: C.mint}} />);
      }
    }
    bar += it.n;
    x += w;
  });

  const total = Math.round(30 - 9 * seg(t, 5.0, 7.8));
  const sp = seg(t, 5.0, 7.8);

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 40, top: 70, fontSize: 48, fontWeight: 700, color: C.paper}}>
        वीडियो की लंबाई: <span style={{color: sp > 0.95 ? C.mint : C.marigold, fontWeight: 800}}>0:{String(total).padStart(2, '0')}</span>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 480, height: 4, background: 'rgba(255,248,236,0.2)'}} />
      {nodes}
      {scissorsOn && (
        <div style={{position: 'absolute', left: scissorsX - 30, top: 175, transform: 'rotate(90deg)'}}><Scissors size={64} /></div>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontSize: 66, fontWeight: 800,
        color: C.marigold, opacity: seg(t, 7.8, 8.6), transform: `scale(${0.8 + 0.2 * pop(t, 7.8)})`}}>
        पेसिंग तेज़!
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontSize: 44, fontWeight: 600, color: C.paper, opacity: seg(t, 8.8, 9.6) * 0.85}}>
        खाली जगह = स्क्रॉल
      </div>
    </div>
  );
};
