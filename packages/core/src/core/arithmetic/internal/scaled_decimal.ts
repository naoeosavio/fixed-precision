export function scaled_decimal(value: string, scale: bigint): bigint {
  const [integer_part = "0", fraction_part = ""] = value.split(".");
  const scale_digits = scale.toString().length - 1;
  const fraction = `${fraction_part}${"0".repeat(scale_digits)}`.slice(
    0,
    scale_digits,
  );
  return BigInt(integer_part) * scale + BigInt(fraction || "0");
}
