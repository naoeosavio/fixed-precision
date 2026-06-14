import { closer_fraction } from "./closer_fraction";

export function limit_denominator(
  numerator: bigint,
  denominator: bigint,
  max_denominator: bigint,
): { numerator: bigint; denominator: bigint } {
  if (max_denominator < 1n) {
    throw new Error("maxDen must be a positive integer");
  }

  if (denominator <= max_denominator) {
    return { numerator, denominator };
  }

  const sign = numerator < 0n ? -1n : 1n;
  const original_numerator = numerator < 0n ? -numerator : numerator;
  const original_denominator = denominator;
  let n = original_numerator;
  let d = original_denominator;
  let previous_numerator = 0n;
  let current_numerator = 1n;
  let previous_denominator = 1n;
  let current_denominator = 0n;

  while (d !== 0n) {
    const quotient = n / d;
    const next_denominator =
      previous_denominator + quotient * current_denominator;

    if (next_denominator > max_denominator) {
      break;
    }

    const next_numerator = previous_numerator + quotient * current_numerator;
    previous_numerator = current_numerator;
    current_numerator = next_numerator;
    previous_denominator = current_denominator;
    current_denominator = next_denominator;
    const remainder = n - quotient * d;
    n = d;
    d = remainder;
  }

  const remaining =
    (max_denominator - previous_denominator) / current_denominator;
  const bound_numerator = previous_numerator + remaining * current_numerator;
  const bound_denominator =
    previous_denominator + remaining * current_denominator;
  const best = closer_fraction(
    original_numerator,
    original_denominator,
    bound_numerator,
    bound_denominator,
    current_numerator,
    current_denominator,
  );

  return {
    numerator: best.numerator * sign,
    denominator: best.denominator,
  };
}
