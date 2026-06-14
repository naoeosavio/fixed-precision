import { power_by_squaring } from "./internal/power_by_squaring";

export function power(value: bigint, exp: number, scale: bigint): bigint {
  if (!Number.isInteger(exp)) throw new Error("Exponent must be an integer");
  if (exp === 0) return scale;

  if (value === 0n) {
    if (exp < 0) throw new Error("0 ** negative is undefined");
    return 0n;
  }

  const isNegativeExponent = exp < 0;
  const absExp = Math.abs(exp);

  let result: bigint;
  if (absExp === 1) {
    result = value;
  } else if (absExp === 2) {
    result = (value * value) / scale;
  } else if (absExp === 3) {
    result = (((value * value) / scale) * value) / scale;
  } else {
    result = power_by_squaring(value, absExp, scale);
  }

  if (isNegativeExponent) {
    return (scale * scale) / result;
  }
  return result;
}
