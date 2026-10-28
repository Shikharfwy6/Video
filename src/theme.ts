import {loadFont} from '@remotion/google-fonts/Baloo2';

const {fontFamily} = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['devanagari', 'latin'],
});

export const FONT = fontFamily;

export const C = {
  bg: '#0F3D3E',
  deep: '#0A2C2E',
  marigold: '#FFC233',
  pink: '#FF4F81',
  paper: '#FFF8EC',
  mint: '#7CE3C3',
  skin: '#E8A878',
  grey: '#8FA9A6',
};
