import { scaled_decimal } from "./scaled_decimal";
import { PI } from "./constants";

const CORDIC_GAIN_STR =
  "0.60725293500888125616944675250492826311239085215008977239565719163848541002672206";

interface CordicCtx {
  table: bigint[];
  gain: bigint;
}

const cache = new Map<bigint, CordicCtx>();

function compute_atan_pow2(scale: bigint, i: number): bigint {
  if (i === 0) {
    return scaled_decimal(PI, scale) / 4n;
  }

  const two_pow_i = 2n ** BigInt(i);
  const two_pow_2i = two_pow_i * two_pow_i;
  let pow = two_pow_i;
  let sum = 0n;

  for (let k = 0; k < 200; k++) {
    const divisor = BigInt(2 * k + 1) * pow;
    const term = scale / divisor;
    if (term === 0n) break;
    if (k % 2 === 0) {
      sum += term;
    } else {
      sum -= term;
    }
    pow *= two_pow_2i;
  }

  return sum;
}

function build_cordic_ctx(scale: bigint, max_iterations: number): CordicCtx {
  const count = Math.min(max_iterations, 90);
  const table: bigint[] = [];

  for (let i = 0; i < count; i++) {
    const value = scale >> BigInt(i);
    if (value === 0n) break;
    if (i >= 31) {
      table.push(value);
    } else {
      table.push(compute_atan_pow2(scale, i));
    }
  }

  return {
    table,
    gain: scaled_decimal(CORDIC_GAIN_STR, scale),
  };
}

function get_cordic_ctx(scale: bigint, max_iterations: number): CordicCtx {
  let ctx = cache.get(scale);
  if (!ctx) {
    ctx = build_cordic_ctx(scale, max_iterations);
    cache.set(scale, ctx);
  }
  if (max_iterations < ctx.table.length) {
    return { table: ctx.table.slice(0, max_iterations), gain: ctx.gain };
  }
  return ctx;
}

export function cordic_sincos(
  angle: bigint,
  scale: bigint,
  max_iterations: number,
): [bigint, bigint] {
  const ctx = get_cordic_ctx(scale, max_iterations);
  const iterations = Math.min(max_iterations, ctx.table.length);

  let x = ctx.gain;
  let y = 0n;
  let z = angle;

  for (let i = 0; i < iterations; i++) {
    const shift = BigInt(i);
    if (z >= 0n) {
      const x_old = x;
      x = x - (y >> shift);
      y = y + (x_old >> shift);
      z = z - ctx.table[i];
    } else {
      const x_old = x;
      x = x + (y >> shift);
      y = y - (x_old >> shift);
      z = z + ctx.table[i];
    }
  }

  return [x, y];
}
