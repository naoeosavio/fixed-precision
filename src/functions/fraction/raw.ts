export function plusRaw(left: bigint, right: bigint): bigint {
  return left + right;
}

export function minusRaw(left: bigint, right: bigint): bigint {
  return left - right;
}

export function productRaw(left: bigint, right: bigint): bigint {
  return left * right;
}

export function fractionRaw(left: bigint, right: bigint): bigint {
  return left / right;
}

export function leftoverRaw(left: bigint, right: bigint): bigint {
  return left % right;
}
