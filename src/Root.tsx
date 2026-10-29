import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {PunchInVideo} from './punchin/PunchInVideo';
import timing from './timing.json';
import punchin from './timing_punchin.json';

export const Root: React.FC = () => (
  <>
    <Composition id="Explainer" component={Video} width={1080} height={1920} fps={timing.fps} durationInFrames={timing.frames} />
    <Composition id="PunchIn" component={PunchInVideo} width={1080} height={1920} fps={punchin.fps} durationInFrames={punchin.frames} />
  </>
);
