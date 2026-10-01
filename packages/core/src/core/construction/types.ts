export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

export type FixedPrecisionConfig = {
  places: number;
  roundingMode?: RoundingMode;
};
