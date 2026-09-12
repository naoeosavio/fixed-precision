export type UnknownFn = (input: any) => any;

type PipeStages<
  Stages extends readonly UnknownFn[],
  Source,
  Out,
> = Stages extends readonly [
  infer First extends UnknownFn,
  ...infer Rest extends readonly UnknownFn[],
]
  ? [Out] extends [Parameters<First>[0]]
    ? PipeStages<Rest, Source, ReturnType<First>>
    : never
  : (source: Source) => Out;

export type PipeResult<Stages extends readonly UnknownFn[]> =
  Stages extends readonly []
    ? <T>(source: T) => T
    : Stages extends readonly [
          infer First extends UnknownFn,
          ...infer Rest extends readonly UnknownFn[],
        ]
      ? PipeStages<Rest, Parameters<First>[0], ReturnType<First>>
      : never;
