export type SqrtNumber<T> = {
  isNegative(): boolean;
  isZero(): boolean;
  add(other: T): T;
  div(other: T): T;
  fraction(other: bigint): T;
  eqRaw(other: T): boolean;
};

export function sqrtWithNewton<T extends SqrtNumber<T>>(
  value: T,
  places: number,
  createZero: () => T,
): T {
  if (value.isNegative()) {
    throw new Error("Square root of negative number");
  }
  if (value.isZero()) {
    return createZero();
  }
  return sqrtGo(value, value.fraction(2n), places);
}

function sqrtGo<T extends SqrtNumber<T>>(value: T, guess: T, iter: number): T {
  if (iter <= 0) {
    return guess;
  }
  const next = guess.add(value.div(guess)).fraction(2n);
  if (guess.eqRaw(next)) {
    return next;
  }
  return sqrtGo(value, next, iter - 1);
}
