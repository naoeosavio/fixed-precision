import type { PipeResult, UnknownFn } from "./types";

function pipeFn<const Fs extends readonly UnknownFn[]>(
  ...fns: Fs
): PipeResult<Fs>;
function pipeFn(...fns: UnknownFn[]): UnknownFn {
  return (source: unknown) =>
    fns.reduce((accumulator, fn) => fn(accumulator), source);
}

export const pipe: typeof pipeFn = pipeFn;
