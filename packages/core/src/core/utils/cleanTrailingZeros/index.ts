type Cleaned = { n: bigint; c: number };

function strip_by_shift(n: bigint, s: bigint): Cleaned {
  let c = 0;
  while (true) {
    const q = n >> s;
    if (n !== q << s) break;
    n = q;
    c++;
  }
  return { n, c };
}

function strip_by_division(n: bigint, base: bigint): Cleaned {
  let c = 0;
  while (true) {
    const q = n / base;
    if (n !== q * base) break;
    n = q;
    c++;
  }
  return { n, c };
}

export function cleanTrailingZeros(
  value: bigint,
  radix: number | bigint = 10,
): Cleaned {
  if (value === 0n) return { n: 0n, c: 0 };

  const base = typeof radix === "bigint" ? radix : BigInt(radix);
  const shift = base === 2n ? 1 : base === 8n ? 3 : base === 16n ? 4 : 0;

  return shift > 0
    ? strip_by_shift(value, BigInt(shift))
    : strip_by_division(value, base);
}
