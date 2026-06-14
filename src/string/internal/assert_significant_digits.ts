export function assert_significant_digits(sd: number): void {
  if (!Number.isInteger(sd) || sd < 1 || sd >= 1e6) {
    throw new Error("Invalid precision");
  }
}
