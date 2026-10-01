import { abs_value } from "../../arithmetic";

export function closer_fraction(
  original_numerator: bigint,
  original_denominator: bigint,
  left_numerator: bigint,
  left_denominator: bigint,
  right_numerator: bigint,
  right_denominator: bigint,
): { numerator: bigint; denominator: bigint } {
  const left_distance = abs_value(
    left_numerator * original_denominator -
      original_numerator * left_denominator,
  );
  const right_distance = abs_value(
    right_numerator * original_denominator -
      original_numerator * right_denominator,
  );

  return left_distance * right_denominator <= right_distance * left_denominator
    ? { numerator: left_numerator, denominator: left_denominator }
    : { numerator: right_numerator, denominator: right_denominator };
}
