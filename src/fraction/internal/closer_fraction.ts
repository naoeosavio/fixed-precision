import { absolute_big_int } from "./absolute_big_int";

export function closer_fraction(
  original_numerator: bigint,
  original_denominator: bigint,
  left_numerator: bigint,
  left_denominator: bigint,
  right_numerator: bigint,
  right_denominator: bigint,
): { numerator: bigint; denominator: bigint } {
  const left_distance = absolute_big_int(
    left_numerator * original_denominator -
      original_numerator * left_denominator,
  );
  const right_distance = absolute_big_int(
    right_numerator * original_denominator -
      original_numerator * right_denominator,
  );

  return left_distance * right_denominator <= right_distance * left_denominator
    ? { numerator: left_numerator, denominator: left_denominator }
    : { numerator: right_numerator, denominator: right_denominator };
}
