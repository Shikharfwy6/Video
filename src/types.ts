export type Word = {t: string; s: number; e: number};
export type Section = {
  key: string; start: number; end: number; speechStart: number; speechEnd: number;
  words: Word[];
  /** sentence start times (seconds, relative to section start) */
  beats?: number[];
};
export type Timing = {fps: number; duration: number; frames: number; sections: Section[]; envelope: number[]};
