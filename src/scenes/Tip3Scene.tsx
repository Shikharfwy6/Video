import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Check, Cross, Muted} from '../icons';
import {pop, seg} from '../util';

const Phone: React.FC<{x: number; show: number; good: boolean}> = ({x, show, good}) => (
  <div style={{position: 'absolute', left: x, top: 230 + (1 - show) * 80, width: 380, height: 500, borderRadius: 44,
    border: `8px solid ${C.paper}`, overflow: 'hidden', opacity: show,
    background: 'linear-gradient(160deg, #3B2F7A, #FF4F81 70%, #FFC233)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', padding: '0 16px'}}>
      {good ? (
        <span style={{fontSize: 56, fontWeight: 800, color: C.deep, background: C.marigold, padding: '2px 16px', borderRadius: 14, lineHeight: 1.5}}>
          बड़ा कैप्शन
        </span>
      ) : (
        <span style={{fontSize: 17, fontWeight: 500, color: '#c9c9c9'}}>छोटा, धुंधला कैप्शन जो पढ़ना मुश्किल है</span>
      )}
    </div>
  </div>
);

export const Tip3Scene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const mute = pop(t, 1.0);
  const a = seg(t, 3.6, 4.6);
  const b = seg(t, 5.6, 6.6);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
        opacity: Math.min(1, mute), transform: `scale(${0.4 + 0.6 * mute}) translateY(${-seg(t, 3.2, 3.8) * 10}px)`}}>
        <Muted size={seg(t, 3.2, 3.8) > 0.5 ? 80 : 150} />
        <span style={{fontSize: seg(t, 3.2, 3.8) > 0.5 ? 50 : 64, fontWeight: 800, color: C.paper}}>बिना आवाज़ के देखते हैं</span>
      </div>
      <Phone x={70} show={a} good={false} />
      <Phone x={550} show={b} good />
      <div style={{position: 'absolute', left: 70, width: 380, top: 735, display: 'flex', justifyContent: 'center', opacity: a}}><Cross size={60} /></div>
      <div style={{position: 'absolute', left: 550, width: 380, top: 735, display: 'flex', justifyContent: 'center', opacity: b}}><Check size={60} /></div>
    </div>
  );
};
