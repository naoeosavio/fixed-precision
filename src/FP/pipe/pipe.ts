import { bind } from "./bind";

function pipeFn<A, B>(ab: (a: A) => B): (source: A) => B;
function pipeFn<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (source: A) => C;
function pipeFn<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (source: A) => D;
function pipeFn<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (source: A) => E;
function pipeFn<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (source: A) => F;
function pipeFn<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (source: A) => G;
function pipeFn<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (source: A) => H;
function pipeFn<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (source: A) => I;
function pipeFn<A, B, C, D, E, F, G, H, I, J>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
): (source: A) => J;
function pipeFn(
  ...fns: Array<(input: any) => any>
): (source: unknown) => unknown {
  return (source: unknown) =>
    fns.reduce((accumulator, fn) => fn(accumulator), source);
}

export const pipe: typeof pipeFn & { bind: typeof bind } = Object.assign(
  pipeFn,
  { bind },
);
