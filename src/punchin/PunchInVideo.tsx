import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import raw from '../timing_punchin.json';
import type {Timing} from '../types';
import {C, FONT} from '../theme';
import {Character} from '../Character';
import {Captions} from '../Captions';
import {SHook, STitle, SHow, SAlt, SWhy, SAmt, SMistake, SCta} from './scenes';
import type {SP} from './scenes';

const timing = raw as unknown as Timing;

const SCENES: Record<string, React.FC<SP>> = {
  hook: SHook, title: STitle, how: SHow, alt: SAlt, why: SWhy, amt: SAmt, mistake: SMistake, cta: SCta,
};
const TAGS: Record<string, string> = {
  hook: 'बोरिंग?', title: 'आज की टिप', how: 'कैसे करें', alt: 'बारी-बारी',
  why: 'क्यों काम करता है', amt: 'कितना ज़ूम', mistake: 'गलती', cta: 'आज़माओ',
};

const Header: React.FC<{k: string; idx: number}> = ({k, idx}) => (
  <div style={{position: 'absolute', left: 50, top: 64, width: 980, fontFamily: FONT}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{background: C.pink, color: C.paper, fontWeight: 800, fontSize: 52, padding: '2px 26px', borderRadius: 22}}>{TAGS[k]}</div>
      <div style={{color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.1}}>पंच-इन ज़ूम</div>
    </div>
    <div style={{display: 'flex', gap: 8, marginTop: 22}}>
      {timing.sections.map((_, n) => (
        <div key={n} style={{flex: 1, height: 10, borderRadius: 5, background: n <= idx ? C.marigold : 'rgba(255,248,236,0.18)'}} />
      ))}
    </div>
  </div>
);

const SceneWrap: React.FC<{idx: number; frames: number}> = ({idx, frames}) => {
  const f = useCurrentFrame();
  const sec = timing.sections[idx];
  const Scene = SCENES[sec.key];
  const fadeIn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [frames - 6, frames], [1, 0], {extrapolateLeft: 'clamp'});
  const rise = interpolate(f, [0, 10], [24, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      <Header k={sec.key} idx={idx} />
      <div style={{position: 'absolute', left: 40, top: 235, width: 1000, height: 780, borderRadius: 48,
        background: 'rgba(10,44,46,0.7)', overflow: 'hidden', transform: `translateY(${rise}px)`, fontFamily: FONT}}>
        <Scene beats={sec.beats ?? [0]} dur={frames / timing.fps} />
      </div>
    </AbsoluteFill>
  );
};

export const PunchInVideo: React.FC = () => {
  const fps = timing.fps;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 140, top: 1230, width: 800, height: 800, borderRadius: 400,
        background: 'radial-gradient(circle, rgba(255,194,51,0.28), rgba(255,194,51,0) 65%)'}} />
      {timing.sections.map((s, i) => {
        const from = Math.round(s.start * fps);
        const end = i === timing.sections.length - 1 ? timing.frames : Math.round(timing.sections[i + 1].start * fps);
        return (
          <Sequence key={s.key} from={from} durationInFrames={end - from}>
            <SceneWrap idx={i} frames={end - from} />
          </Sequence>
        );
      })}
      <Captions timing={timing} />
      <div style={{position: 'absolute', left: 220, top: 1237}}>
        <Character timing={timing} />
      </div>
      <Audio src={staticFile('voice_punchin.mp3')} />
    </AbsoluteFill>
  );
};
