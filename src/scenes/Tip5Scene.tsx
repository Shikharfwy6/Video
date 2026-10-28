import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {Check, Cross, Sparkle} from '../icons';
import {lerp, pop, seg} from '../util';

const Chip: React.FC<{label: string; sub: string; on: number}> = ({label, sub, on}) => (
  <div style={{padding: '18px 38px', borderRadius: 34, background: C.paper, color: C.deep, opacity: Math.min(1, on),
    transform: `scale(${Math.max(0.01, on)})`, display: 'flex', alignItems: 'center', gap: 18}}>
    <Sparkle size={56} />
    <div>
      <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1}}>{label}</div>
      <div style={{fontSize: 32, fontWeight: 600, opacity: 0.7}}>{sub}</div>
    </div>
  </div>
);

export const Tip5Scene: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const gaugeOn = seg(t, 7.6, 8.4);
  // knob: 0.10 -> 0.93 (over-edit) -> 0.42 (sweet spot)
  const up = seg(t, 8.4, 10.3);
  const back = seg(t, 10.9, 11.9);
  const knob = lerp(lerp(0.1, 0.93, up), 0.42, back);
  const fake = knob > 0.6;
  const real = t > 11.9;
  const shake = fake && t < 11 ? Math.sin(t * 55) * 5 : 0;

  const GX = 70, GW = 860;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 70, display: 'flex', gap: 28, justifyContent: 'center'}}>
        <Chip label="CapCut" sub="तेज़ कट्स" on={pop(t, 3.0)} />
        <Chip label="Descript" sub="ऑटो कैप्शन" on={pop(t, 3.9)} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 245, textAlign: 'center', fontSize: 40, fontWeight: 600, color: C.paper, opacity: seg(t, 5, 6) * 0.85}}>
        कैप्शन और कट्स के लिए
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontSize: 58, fontWeight: 800, color: C.paper, opacity: gaugeOn}}>
        पॉलिश कितनी?
      </div>

      <div style={{position: 'absolute', left: GX, top: 470, width: GW, height: 40, borderRadius: 20, overflow: 'hidden', opacity: gaugeOn, display: 'flex'}}>
        <div style={{width: '25%', background: C.grey}} />
        <div style={{width: '35%', background: C.mint}} />
        <div style={{width: '40%', background: C.pink}} />
      </div>
      <div style={{position: 'absolute', left: GX + GW * knob - 34 + shake, top: 450, width: 68, height: 80, borderRadius: 34,
        background: C.paper, border: `8px solid ${C.deep}`, boxSizing: 'border-box', opacity: gaugeOn}} />

      <div style={{position: 'absolute', left: GX + GW * 0.25 + 20, top: 540, fontSize: 40, fontWeight: 800, color: C.mint, opacity: gaugeOn}}>असली</div>
      <div style={{position: 'absolute', left: GX + GW * 0.72, top: 540, fontSize: 40, fontWeight: 800, color: C.pink, opacity: gaugeOn}}>नकली</div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 630, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
        fontSize: 66, fontWeight: 800, color: real ? C.mint : C.pink, opacity: seg(t, 9.2, 9.8) * (t > 10.8 && !real ? 0 : 1) + (real ? seg(t, 11.9, 12.5) : 0)}}>
        {real ? <><Check size={66} /> असली अंदाज़ जीतता है</> : <><Cross size={66} /> ज़्यादा पॉलिश = नकली</>}
      </div>
    </div>
  );
};
