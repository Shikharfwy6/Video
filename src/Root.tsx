import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import timing from './timing.json';

export const Root: React.FC = () => (
  <Composition
    id="Explainer"
    component={Video}
    width={1080}
    height={1920}
    fps={timing.fps}
    durationInFrames={timing.frames}
  />
);
