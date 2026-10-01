/**
 * Binds the trailing arguments of a standalone function, leaving the value to
 * flow as the first argument.
 *
 * @param fn - Standalone function whose trailing arguments are bound.
 * @param bound - Trailing arguments passed after the value on every call.
 * @returns Unary transform `(value) => fn(value, ...bound)`.
 */
export function partial<First, Rest extends unknown[], Out>(
  fn: (first: First, ...rest: Rest) => Out,
  ...bound: Rest
): (first: First) => Out {
  return (first) => fn(first, ...bound);
}
