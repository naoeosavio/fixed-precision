export function add(left: bigint, right: bigint): bigint {
  return left + right;
}

export function subtract(left: bigint, right: bigint): bigint {
  return left - right;
}

export function multiply(left: bigint, right: bigint): bigint {
  return left * right;
}

export function divide(left: bigint, right: bigint): bigint {
  return left / right;
}

export function modulo(left: bigint, right: bigint): bigint {
  return left % right;
}

export function negate(value: bigint): bigint {
  return -value;
}

export function power(value: bigint, exp: number, scale: bigint): bigint {
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
