import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Check, Cross} from '../icons';
import {lerp, seg} from '../util';

const FW = 840, FH = 473;       // 16:9 frame
const CW = 266;                 // 9:16 crop window width at height FH

const Subject: React.FC<{cx: number}> = ({cx}) => (
  <g>
    <circle cx={cx} cy={150} r={46} fill={C.skin} />
    <path d={`M${cx - 78} ${FH} C${cx - 78} 260 ${cx + 78} 260 ${cx + 78} ${FH} Z`} fill={C.marigold} />
  </g>
);

export const Tip4Scene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const subjX = 640;                       // subject sits to the right of centre
  const centre = FW / 2 - CW / 2;          // blind centre-crop
  const smart = subjX - CW / 2;            // framed on subject
  const move = seg(t, 5.4, 6.6);
  const cropX = lerp(centre, smart, move);
  const appear = seg(t, 2.0, 3.0);
  const blind = t < 5.2;

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 80, top: 50, width: FW, height: FH, borderRadius: 24, overflow: 'hidden',
        background: 'linear-gradient(120deg,#1B6F6E,#2C4C8C)', border: `6px solid ${C.paper}`, boxSizing: 'content-box'}}>
        <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`} style={{position: 'absolute', inset: 0}}>
          <Subject cx={subjX} />
          {/* dark mask outside the 9:16 window */}
          <rect x={0} y={0} width={cropX} height={FH} fill="rgba(0,0,0,0.6)" opacity={appear} />
          <rect x={cropX + CW} y={0} width={FW - cropX - CW} height={FH} fill="rgba(0,0,0,0.6)" opacity={appear} />
          <rect x={cropX} y={0} width={CW} height={FH} fill="none" stroke={blind ? C.pink : C.mint} strokeWidth={6} opacity={appear} />
        </svg>
        <div style={{position: 'absolute', left: 16, top: 12, fontSize: 40, fontWeight: 800, color: C.paper}}>16:9</div>
      </div>


      {/* result phone */}

      <div style={{position: 'absolute', left: 210, top: 585, width: 266 * 0.62, height: 473 * 0.62 + 4, borderRadius: 26,
        border: `6px solid ${C.paper}`, overflow: 'hidden', background: 'linear-gradient(120deg,#1B6F6E,#2C4C8C)', opacity: appear}}>
        <svg width={266 * 0.62} height={473 * 0.62} viewBox={`${cropX} 0 ${CW} ${FH}`}>
          <Subject cx={subjX} />
        </svg>
      </div>

      <div style={{position: 'absolute', left: 520, top: 610, width: 420, fontSize: 58, fontWeight: 800, lineHeight: 1.25,
        color: blind ? C.pink : C.mint, opacity: seg(t, 3.4, 4.2), display: 'flex', alignItems: 'center', gap: 14}}>
        {blind ? <><Cross size={58} /> सिर्फ़ क्रॉप</> : <><Check size={58} /> सही फ़्रेमिंग</>}
      </div>
      <div style={{position: 'absolute', left: 520, top: 690, width: 420, fontSize: 38, fontWeight: 600, color: C.paper, opacity: seg(t, 4.0, 4.8) * 0.85}}>
        {blind ? 'आधा चेहरा कट गया' : 'हीरो फ़्रेम के बीच में'}
      </div>
    </div>
  );
};
