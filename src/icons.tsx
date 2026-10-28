import React from 'react';

type P = {size?: number; color?: string};
const S = ({size = 48, children}: {size?: number; children: React.ReactNode}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{children}</svg>
);

export const Check: React.FC<P> = ({size, color = '#7CE3C3'}) => (
  <S size={size}><path d="M4 12.5l5 5L20 6.5" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></S>
);
export const Cross: React.FC<P> = ({size, color = '#FF4F81'}) => (
  <S size={size}><path d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth={3.2} strokeLinecap="round" /></S>
);
export const Star: React.FC<P> = ({size, color = '#FFC233'}) => (
  <S size={size}><polygon points="12,2 15,9 22,9.5 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.5 9,9" fill={color} /></S>
);
export const Scissors: React.FC<P> = ({size, color = '#FFF8EC'}) => (
  <S size={size}>
    <circle cx="6" cy="6" r="3" stroke={color} strokeWidth={2} />
    <circle cx="6" cy="18" r="3" stroke={color} strokeWidth={2} />
    <path d="M8.5 7.5L20 16M8.5 16.5L20 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </S>
);
export const Muted: React.FC<P> = ({size, color = '#FFF8EC'}) => (
  <S size={size}>
    <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill={color} />
    <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" stroke="#FF4F81" strokeWidth={2.4} strokeLinecap="round" />
  </S>
);
export const Sparkle: React.FC<P> = ({size, color = '#FFC233'}) => (
  <S size={size}><path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill={color} /></S>
);
export const Loop: React.FC<P> = ({size, color = '#FFC233'}) => (
  <S size={size}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
    <path d="M20.5 3.5v5h-5" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </S>
);
