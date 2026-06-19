import type { FPContext } from "../FixedPrecision";

export function to_string_with_ctx(value: bigint, ctx: FPContext): string {
  const P = ctx.places;

  if (P === 0) return value.toString();
  if (value === 0n) return "0";

  const str = value.toString();
  const is_negative = str[0] === "-";
  const len = str.length - (is_negative ? 1 : 0);

  if (len > P) {
    return `${str.slice(0, -P)}.${str.slice(-P)}`;
  }

  if (is_negative) {
    return `-0.${"0".repeat(P - len)}${str.slice(1)}`;
  }

  return `0.${"0".repeat(P - len)}${str}`;
}
