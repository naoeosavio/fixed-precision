import { count_power_of_ten } from "./count_power_of_ten";

export function exact_power_of_ten_log(
  value: bigint,
  scale: bigint,
): bigint | undefined {
  if (value === scale) {
    return 0n;
  }

  if (value > scale) {
    if (value % scale !== 0n) {
      return undefined;
    }
    const exponent = count_power_of_ten(value / scale);
    return exponent === undefined ? undefined : exponent * scale;
  }

  if (scale % value !== 0n) {
    return undefined;
  }

  const exponent = count_power_of_ten(scale / value);
  return exponent === undefined ? undefined : -exponent * scale;
}
