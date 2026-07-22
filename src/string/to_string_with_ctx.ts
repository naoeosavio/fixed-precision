import type { FPContext } from "../FixedPrecision";

export function to_string_with_ctx(value: bigint, ctx: FPContext, trimZeros = true): string {
  const P = ctx.places;

  if (P === 0) return value.toString();
  if (value === 0n) return "0";

  const str = value.toString();
  const len = str.length;

  let j = len;

  if (trimZeros && str[len - 1] === "0") {
    const min = len - P;
    while (j > min && str[j - 1] === "0") {
      --j;
    }
  }

  const effective_places = P - len + j;

  //X.XX
  if (effective_places === 0) {
    return str.slice(0, j);
  }

  const start = str[0] === "-" ? 1 : 0;
  const clean_len = j - start;
  if (clean_len > effective_places) {
    const dot = j - effective_places;
    return `${str.slice(0, dot)}.${str.substring(dot, j)}`;
  }

  //0.XX
  const abs = str.slice(start, j);

  if (clean_len === effective_places) {
    return (start ? "-0." : "0.") + abs;
  }

  //0.0X
  return (
    (start ? "-0." : "0.") + "0".repeat(effective_places - clean_len) + abs
  );
}
