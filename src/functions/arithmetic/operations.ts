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
