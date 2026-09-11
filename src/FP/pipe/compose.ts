import type { PipeResult, UnknownFn } from "./types";

type Reverse<T extends readonly unknown[]> = T extends readonly [
  ...infer Init,
  infer Last,
]
  ? [Last, ...Reverse<Init>]
  : [];

type ComposeResult<Fs extends readonly UnknownFn[]> = PipeResult<Reverse<Fs>>;

function composeFn<const Fs extends readonly UnknownFn[]>(
  ...stages: Fs
): ComposeResult<Fs>;
function composeFn(...stages: UnknownFn[]): UnknownFn {
  return (source: unknown) =>
    stages.reduceRight((accumulator, stage) => stage(accumulator), source);
}

export const compose: typeof composeFn = composeFn;
