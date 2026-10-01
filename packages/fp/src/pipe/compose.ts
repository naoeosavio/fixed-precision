import type { PipeResult, UnknownFn } from "./types";

type Reverse<
  Stages extends readonly unknown[],
  Reversed extends readonly unknown[] = [],
> = Stages extends readonly [infer First, ...infer Rest]
  ? Reverse<Rest, [First, ...Reversed]>
  : Reversed;

type ComposeResult<Stages extends readonly UnknownFn[]> = PipeResult<
  Reverse<Stages>
>;

function composeFn<const Stages extends readonly UnknownFn[]>(
  ...stages: Stages
): ComposeResult<Stages>;
function composeFn(...stages: UnknownFn[]): UnknownFn {
  return (source: unknown) =>
    stages.reduceRight((accumulator, stage) => stage(accumulator), source);
}

export const compose: typeof composeFn = composeFn;
