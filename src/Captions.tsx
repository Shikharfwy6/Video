import React from 'react';
import {useCurrentFrame} from 'remotion';
import timing from './timing.json';
import {C, FONT} from './theme';
import {pop} from './util';

type W = {t: string; s: number; e: number};
type Chunk = {words: W[]; s: number; e: number};

const chunks: Chunk[] = [];
timing.sections.forEach((sec) => {
  let cur: W[] = [];
  sec.words.forEach((w, i) => {
    cur.push(w);
    const last = i === sec.words.length - 1;
    if (/[।,?!.…:]$/.test(w.t) || cur.length >= 4 || last) {
      chunks.push({words: cur, s: cur[0].s, e: cur[cur.length - 1].e});
      cur = [];
    }
  });
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / timing.fps;

  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].s - 0.04) idx = i;
  if (idx < 0) return null;
  const ch = chunks[idx];
  const next = chunks[idx + 1];
  const hideAt = Math.min(ch.e + 0.45, next ? next.s : Infinity);
  if (t > hideAt) return null;

  const scale = 0.92 + 0.08 * Math.min(1, pop(t, ch.s));

  return (
    <div
      style={{
        position: 'absolute', left: 50, width: 980, top: 1035, height: 270,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center',
        gap: '2px 16px', transform: `scale(${scale})`, fontFamily: FONT,
      }}
    >
      {ch.words.map((w, i) => {
        const active = t >= w.s && t < w.e;
        const done = t >= w.e;
        return (
          <span
            key={i}
            style={{
              fontSize: 88, fontWeight: 800, lineHeight: 1.15, padding: '0 14px', borderRadius: 18,
              color: active ? C.deep : C.paper,
              background: active ? C.marigold : 'transparent',
              opacity: active || done ? 1 : 0.62,
              textShadow: active ? 'none' : '0 4px 0 rgba(0,0,0,0.35)',
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
