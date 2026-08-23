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

export type FixedPrecisionData = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
  value: bigint;
};

export type FixedPrecisionOperand =
  | string
  | number
  | bigint
  | FixedPrecisionData;

export type PlacesOptions = {
  places?: number;
  roundingMode?: RoundingMode;
};

export type ScaleOptions = {
  places: number;
  roundingMode?: RoundingMode;
};

export type SdOptions = {
  sd?: number;
  roundingMode?: RoundingMode;
};

export type RequiredSdOptions = {
  sd: number;
  roundingMode?: RoundingMode;
};

export type BaseOptions = {
  base?: FixedPrecisionOperand;
};

export type MaxDenOptions = {
  maxDen?: FixedPrecisionOperand;
};
