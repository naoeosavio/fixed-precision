export function partial<A, C>(
  fn: (first: A, ...rest: any[]) => C,
  ...bound: any[]
): (first: A) => C {
  return (first) => fn(first, ...bound);
}
