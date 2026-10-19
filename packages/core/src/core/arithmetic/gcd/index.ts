export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y > 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}
