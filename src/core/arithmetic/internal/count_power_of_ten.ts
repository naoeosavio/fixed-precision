export function count_power_of_ten(value: bigint): bigint | undefined {
  let current = value;
  let exponent = 0n;

  while (current > 1n && current % 10n === 0n) {
    current /= 10n;
    exponent += 1n;
  }

  return current === 1n ? exponent : undefined;
}
