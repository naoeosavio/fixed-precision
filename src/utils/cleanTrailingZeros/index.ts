// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: inherited legacy implementation
export function cleanTrailingZeros(
  value: bigint,
  radix: number | bigint = 10,
): { n: bigint; c: number } {
  if (value === 0n) return { n: 0n, c: 0 };

  const base = typeof radix === "bigint" ? radix : BigInt(radix);
  const shift = base === 2n ? 1 : base === 8n ? 3 : base === 16n ? 4 : 0;

  let n = value;
  let c = 0;

  if (shift > 0) {
    const s = BigInt(shift);
    while (true) {
      const q = n >> s;
      if (n !== q << s) break;
      n = q;
      c++;
    }
  } else {
    while (true) {
      const q = n / base;
      if (n !== q * base) break;
      n = q;
      c++;
    }
  }

  return { n, c };
}
