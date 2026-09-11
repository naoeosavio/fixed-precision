export type UnknownFn = (input: any) => any;

export type PipeResult<Fs extends readonly UnknownFn[]> = Fs extends readonly [
  infer First extends UnknownFn,
  ...infer Rest extends readonly UnknownFn[],
]
  ? Rest extends readonly []
    ? (source: Parameters<First>[0]) => ReturnType<First>
    : PipeResult<Rest> extends (source: infer In) => infer Out
      ? [ReturnType<First>] extends [In]
        ? (source: Parameters<First>[0]) => Out
        : never
      : never
  : never;
