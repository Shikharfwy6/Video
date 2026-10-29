import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import defaultTiming from './timing.json';
import type {Timing} from './types';
import {C, FONT} from './theme';

// Right-arm angle per section (negative = hand raised). Eased at each section start.
const ARM: Record<string, number> = {
  hook: -165, tip1: -135, tip2: -150, tip3: -130, tip4: -150, tip5: -135, cta: -170,
  title: -165, how: -140, alt: -150, why: -130, amt: -145, mistake: -120,
};

export const Character: React.FC<{timing?: Timing}> = ({timing = defaultTiming as unknown as Timing}) => {
  const env = timing.envelope;
  const fps = timing.fps;
  const {armInput, armOutput} = useMemo(() => {
    const inp: number[] = [];
    const out: number[] = [];
    timing.sections.forEach((sec, i) => {
      const f0 = Math.round(sec.start * fps);
      const cur = ARM[sec.key] ?? -145;
      const prev = i === 0 ? cur : ARM[timing.sections[i - 1].key] ?? -145;
      inp.push(f0, f0 + 14);
      out.push(prev, cur);
    });
    return {armInput: inp, armOutput: out};
  }, [timing, fps]);
  const frame = useCurrentFrame();
  const a = env[Math.min(frame, env.length - 1)] ?? 0;
  const aPrev = env[Math.max(0, Math.min(frame - 1, env.length - 1))] ?? 0;
  const open = (a + aPrev) / 2;

  const bob = -open * 7 + Math.sin(frame / 14) * 2;
  const tilt = Math.sin(frame / 26) * 2.2 + open * Math.sin(frame / 5) * 1.5;
  const armR = interpolate(frame, armInput, armOutput) + Math.sin(frame / 5) * (4 + open * 14);
  const armL = 24 + Math.sin(frame / 17) * 3;

  // blink every ~3s
  const bf = frame % 95;
  const blink = bf < 4 ? 0.1 : 1;
  const brow = -open * 7;

  const mouthRx = 20 + open * 9;
  const mouthRy = 3 + open * 24;

  return (
    <svg width={640} height={683} viewBox="0 0 600 640" style={{overflow: 'visible'}}>
      {/* arms behind torso edge */}
      <g transform={`rotate(${armL} 160 485)`}>
        <rect x={138} y={485} width={44} height={165} rx={22} fill={C.marigold} />
        <circle cx={160} cy={660} r={30} fill={C.skin} />
      </g>

      {/* torso (hoodie) */}
      <path d="M95 640 C95 470 190 395 300 395 C410 395 505 470 505 640 Z" fill={C.marigold} />
      <path d="M255 395 Q300 450 345 395" fill="#E5A91B" />
      <path d="M270 430 L266 500 M330 430 L334 500" stroke="#FFF8EC" strokeWidth={5} strokeLinecap="round" />
      <rect x={232} y={540} width={136} height={52} rx={26} fill="#E5A91B" />
      <text x={300} y={577} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.deep}>बंटी</text>

      {/* right arm (gesturing) */}
      <g transform={`rotate(${armR} 440 485)`}>
        <rect x={418} y={485} width={44} height={165} rx={22} fill={C.marigold} />
        <circle cx={440} cy={660} r={30} fill={C.skin} />
        <rect x={436} y={680} width={8} height={26} rx={4} fill={C.skin} />
      </g>

      {/* head group */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} 300 330)`}>
        <rect x={262} y={335} width={76} height={70} rx={30} fill="#D89560" />
        {/* ears */}
        <ellipse cx={192} cy={262} rx={16} ry={26} fill={C.skin} />
        <ellipse cx={408} cy={262} rx={16} ry={26} fill={C.skin} />
        {/* face */}
        <ellipse cx={300} cy={250} rx={108} ry={122} fill={C.skin} />
        {/* hair */}
        <path d="M188 232 C178 130 240 108 300 108 C366 108 424 140 412 232 C400 188 360 168 300 168 C240 168 202 190 188 232 Z" fill="#1E1A24" />
        <path d="M205 160 C230 120 290 100 330 110" stroke="#1E1A24" strokeWidth={18} strokeLinecap="round" fill="none" />
        {/* headphones */}
        <path d="M184 250 C170 90 430 90 416 250" stroke={C.pink} strokeWidth={16} fill="none" strokeLinecap="round" />
        <rect x={166} y={228} width={40} height={78} rx={20} fill={C.pink} />
        <rect x={394} y={228} width={40} height={78} rx={20} fill={C.pink} />
        {/* eyes */}
        <g transform={`translate(0 ${brow * 0})`}>
          <ellipse cx={258} cy={246} rx={17} ry={20 * blink} fill="#fff" />
          <ellipse cx={342} cy={246} rx={17} ry={20 * blink} fill="#fff" />
          <circle cx={262 + Math.sin(frame / 40) * 3} cy={248} r={8 * (blink > 0.5 ? 1 : 0.3)} fill="#1B1B2F" />
          <circle cx={346 + Math.sin(frame / 40) * 3} cy={248} r={8 * (blink > 0.5 ? 1 : 0.3)} fill="#1B1B2F" />
        </g>
        {/* brows */}
        <path d={`M236 ${214 + brow} Q258 ${204 + brow} 280 ${214 + brow}`} stroke="#1E1A24" strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d={`M320 ${214 + brow} Q342 ${204 + brow} 364 ${214 + brow}`} stroke="#1E1A24" strokeWidth={7} strokeLinecap="round" fill="none" />
        {/* nose + cheeks */}
        <path d="M296 262 Q290 286 304 288" stroke="#C98050" strokeWidth={5} strokeLinecap="round" fill="none" />
        <circle cx={236} cy={296} r={14} fill="#FF8F8F" opacity={0.35} />
        <circle cx={364} cy={296} r={14} fill="#FF8F8F" opacity={0.35} />
        {/* mouth (lip-synced to voiceover loudness) */}
        {open < 0.06 ? (
          <path d="M270 318 Q300 340 330 318" stroke="#7A2E3A" strokeWidth={7} strokeLinecap="round" fill="none" />
        ) : (
          <g>
            <ellipse cx={300} cy={322 + mouthRy * 0.35} rx={mouthRx} ry={mouthRy} fill="#6B1F2D" />
            <rect x={300 - mouthRx * 0.75} y={322 + mouthRy * 0.35 - mouthRy} width={mouthRx * 1.5} height={Math.min(9, mouthRy * 0.5)} rx={3} fill="#fff" />
            <ellipse cx={300} cy={322 + mouthRy * 0.9} rx={mouthRx * 0.55} ry={mouthRy * 0.38} fill="#FF7A8A" />
          </g>
        )}
      </g>
    </svg>
  );
};
