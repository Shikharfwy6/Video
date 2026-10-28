import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Loop} from '../icons';
import {pop, seg} from '../util';

export const CtaScene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const btn = pop(t, 1.2);
  const pulse = 1 + Math.sin(t * 6) * 0.04 * seg(t, 1.8, 2.2);
  const loopIn = seg(t, 4.4, 5.2);
  const spin = (t - 4.4) * 220;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontSize: 66, fontWeight: 800, color: C.paper,
        opacity: seg(t, 0.1, 0.7)}}>
        और टिप्स चाहिए?
      </div>
      <div style={{position: 'absolute', left: 250, top: 250, width: 500, height: 150, borderRadius: 75, background: C.pink,
        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 80, fontWeight: 800, color: C.paper,
        opacity: Math.min(1, btn), transform: `scale(${Math.max(0.01, btn) * pulse})`}}>
        फ़ॉलो करो
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, opacity: loopIn}}>
        <div style={{transform: `rotate(${spin}deg)`}}><Loop size={150} /></div>
        <div style={{fontSize: 60, fontWeight: 800, color: C.marigold, lineHeight: 1.15}}>अंत = शुरुआत<br />वीडियो लूप होगा</div>
      </div>
    </div>
  );
};
