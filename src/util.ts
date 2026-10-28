export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = (x: number) => {
  const v = clamp01(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
/** 0..1 eased progress of time t between a and b (seconds) */
export const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const pop = (t: number, a: number) => {
  // overshoot pop-in starting at time a
  const x = clamp01((t - a) / 0.4);
  const c1 = 1.70158, c3 = c1 + 1;
  return x === 0 ? 0 : 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
