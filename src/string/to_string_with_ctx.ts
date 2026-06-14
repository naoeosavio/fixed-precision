import type { FPContext } from "../FixedPrecision";

export function to_string_with_ctx(value: bigint, ctx: FPContext): string {
  const P = ctx.places;

  if (P === 0) return value.toString();

  const str = value.toString();
  const is_negative = str[0] === "-";
  const len = is_negative ? str.length - 1 : str.length;

  if (len > P) {
    return `${str.slice(0, -P)}.${str.slice(-P)}`;
  }

  if (is_negative) {
    return `-0.${str.slice(1).padStart(P, "0")}`;
  }

  return `0.${str.padStart(P, "0")}`;
}
