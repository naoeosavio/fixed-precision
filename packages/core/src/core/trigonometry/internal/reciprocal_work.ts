import { assert_non_zero } from "./assert_non_zero";

export function reciprocal_work(
  value: bigint,
  scale: bigint,
  name: string,
): bigint {
  assert_non_zero(value, `${name} is undefined for zero`);
  return (scale * scale) / value;
}
