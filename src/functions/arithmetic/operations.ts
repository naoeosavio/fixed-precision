export function addRaw(left: bigint, right: bigint): bigint {
  return left + right;
}

export function subRaw(left: bigint, right: bigint): bigint {
  return left - right;
}

export function mulRaw(left: bigint, right: bigint, scale: bigint): bigint {
  return (left * right) / scale;
}

export function divRaw(left: bigint, right: bigint, scale: bigint): bigint {
  return (left * scale) / right;
}

export function modRaw(left: bigint, right: bigint, scale: bigint): bigint {
  return (left * scale) % right;
}

export function negRaw(value: bigint): bigint {
  return -value;
}

export function powRaw(value: bigint, exp: number, scale: bigint): bigint {
  if (!Number.isInteger(exp)) throw new Error("Exponent must be an integer");
  if (exp === 0) return scale;

  if (value === 0n) {
    if (exp < 0) throw new Error("0 ** negative is undefined");
    return 0n;
  }

  let e = Math.abs(exp);
  let base = value;
  let acc = scale;

  while (e > 0) {
    if (e & 1) acc = (acc * base) / scale;
    base = (base * base) / scale;
    e = e >> 1;
  }

  if (exp < 0) {
    return (scale * scale) / acc;
  }
  return acc;
}
