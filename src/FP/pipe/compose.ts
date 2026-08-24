function composeFn<A, B>(f: (a: A) => B): (source: A) => B;
function composeFn<A, B, C>(f: (b: B) => C, g: (a: A) => B): (source: A) => C;
function composeFn<A, B, C, D>(
  f: (c: C) => D,
  g: (b: B) => C,
  h: (a: A) => B,
): (source: A) => D;
function composeFn<A, B, C, D, E>(
  f: (d: D) => E,
  g: (c: C) => D,
  h: (b: B) => C,
  i: (a: A) => B,
): (source: A) => E;
function composeFn<A, B, C, D, E, F>(
  f: (e: E) => F,
  g: (d: D) => E,
  h: (c: C) => D,
  i: (b: B) => C,
  j: (a: A) => B,
): (source: A) => F;
function composeFn<A, B, C, D, E, F, G>(
  f: (f: F) => G,
  g: (e: E) => F,
  h: (d: D) => E,
  i: (c: C) => D,
  j: (b: B) => C,
  k: (a: A) => B,
): (source: A) => G;
function composeFn<A, B, C, D, E, F, G, H>(
  f: (g: G) => H,
  g: (f: F) => G,
  h: (e: E) => F,
  i: (d: D) => E,
  j: (c: C) => D,
  k: (b: B) => C,
  l: (a: A) => B,
): (source: A) => H;
function composeFn<A, B, C, D, E, F, G, H, I>(
  f: (h: H) => I,
  g: (g: G) => H,
  h: (f: F) => G,
  i: (e: E) => F,
  j: (d: D) => E,
  k: (c: C) => D,
  l: (b: B) => C,
  m: (a: A) => B,
): (source: A) => I;
function composeFn<A, B, C, D, E, F, G, H, I, J>(
  f: (i: I) => J,
  g: (h: H) => I,
  h: (g: G) => H,
  i: (f: F) => G,
  j: (e: E) => F,
  k: (d: D) => E,
  l: (c: C) => D,
  m: (b: B) => C,
  n: (a: A) => B,
): (source: A) => J;
function composeFn<A, B, C, D, E, F, G, H, I, J, K>(
  f: (j: J) => K,
  g: (i: I) => J,
  h: (h: H) => I,
  i: (g: G) => H,
  j: (f: F) => G,
  k: (e: E) => F,
  l: (d: D) => E,
  m: (c: C) => D,
  n: (b: B) => C,
  o: (a: A) => B,
): (source: A) => K;
function composeFn(...stages: Array<(input: any) => any>): (source: any) => any;
function composeFn(
  ...stages: Array<(input: any) => any>
): (source: unknown) => unknown {
  return (source: unknown) =>
    stages.reduceRight((accumulator, stage) => stage(accumulator), source);
}

export const compose: typeof composeFn = composeFn;
