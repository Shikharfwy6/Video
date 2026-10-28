import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import timing from './timing.json';
import {C, FONT} from './theme';
import {Character} from './Character';
import {Captions} from './Captions';
import {HookScene} from './scenes/HookScene';
import {Tip1Scene} from './scenes/Tip1Scene';
import {Tip2Scene} from './scenes/Tip2Scene';
import {Tip3Scene} from './scenes/Tip3Scene';
import {Tip4Scene} from './scenes/Tip4Scene';
import {Tip5Scene} from './scenes/Tip5Scene';
import {CtaScene} from './scenes/CtaScene';

const SCENES: Record<string, React.FC> = {
  hook: HookScene, tip1: Tip1Scene, tip2: Tip2Scene, tip3: Tip3Scene,
  tip4: Tip4Scene, tip5: Tip5Scene, cta: CtaScene,
};

const HEAD: Record<string, {tag: string; title: string; step: number}> = {
  hook: {tag: '2026', title: 'वीडियो एडिटिंग टिप्स', step: 0},
  tip1: {tag: 'टिप 1', title: 'पहले हुक, फिर इंट्रो', step: 1},
  tip2: {tag: 'टिप 2', title: 'डेड एयर काट दो', step: 2},
  tip3: {tag: 'टिप 3', title: 'कैप्शन ज़रूर लगाओ', step: 3},
  tip4: {tag: 'टिप 4', title: 'वर्टिकल सोचो', step: 4},
  tip5: {tag: 'टिप 5', title: 'AI हाँ, ओवर-एडिट ना', step: 5},
  cta: {tag: 'बस इतना', title: 'फ़ॉलो करो', step: 5},
};

const Header: React.FC<{k: string}> = ({k}) => {
  const h = HEAD[k];
  return (
    <div style={{position: 'absolute', left: 50, top: 64, width: 980, fontFamily: FONT}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{background: C.pink, color: C.paper, fontWeight: 800, fontSize: 56, padding: '2px 26px', borderRadius: 22}}>
          {h.tag}
        </div>
        <div style={{color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.1}}>{h.title}</div>
      </div>
      <div style={{display: 'flex', gap: 10, marginTop: 22}}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{flex: 1, height: 10, borderRadius: 5, background: n <= h.step ? C.marigold : 'rgba(255,248,236,0.18)'}} />
        ))}
      </div>
    </div>
  );
};

const SceneWrap: React.FC<{k: string; frames: number}> = ({k, frames}) => {
  const f = useCurrentFrame();
  const Scene = SCENES[k];
  const fadeIn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(f, [frames - 6, frames], [1, 0], {extrapolateLeft: 'clamp'});
  const rise = interpolate(f, [0, 10], [24, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
      <Header k={k} />
      <div
        style={{
          position: 'absolute', left: 40, top: 235, width: 1000, height: 780,
          borderRadius: 48, background: 'rgba(10,44,46,0.7)', overflow: 'hidden',
          transform: `translateY(${rise}px)`, fontFamily: FONT,
        }}
      >
        <Scene />
      </div>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const fps = timing.fps;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      {/* soft spotlight behind the host */}
      <div style={{position: 'absolute', left: 140, top: 1230, width: 800, height: 800, borderRadius: 400, background: 'radial-gradient(circle, rgba(255,194,51,0.28), rgba(255,194,51,0) 65%)'}} />

      {timing.sections.map((s, i) => {
        const from = Math.round(s.start * fps);
        const end = i === timing.sections.length - 1 ? timing.frames : Math.round(timing.sections[i + 1].start * fps);
        const frames = end - from;
        return (
          <Sequence key={s.key} from={from} durationInFrames={frames}>
            <SceneWrap k={s.key} frames={frames} />
          </Sequence>
        );
      })}

      <Captions />

      <div style={{position: 'absolute', left: 220, top: 1237}}>
        <Character />
      </div>

      <Audio src={staticFile('voiceover.mp3')} />
    </AbsoluteFill>
  );
};
