type RestParams<Fn> = Fn extends (first: any, ...rest: infer Rest) => any
  ? Rest
  : never;

export function partial<Fn extends (first: any, ...rest: any[]) => any>(
  fn: Fn,
  ...bound: RestParams<Fn>
): (first: Parameters<Fn>[0]) => ReturnType<Fn> {
  return (first) => fn(first, ...bound);
}
