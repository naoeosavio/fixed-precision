export function bitAnd(left: bigint, right: bigint): bigint {
  return left & right;
}

export function bitOr(left: bigint, right: bigint): bigint {
  return left | right;
}

export function bitXor(left: bigint, right: bigint): bigint {
  return left ^ right;
}

export function bitNot(value: bigint): bigint {
  return ~value;
}

export function leftShift(value: bigint, shift: number): bigint {
  return value << BigInt(shift);
}

export function rightArithShift(value: bigint, shift: number): bigint {
  return value >> BigInt(shift);
}
