export function zero_with_precision(sd: number): string {
  return sd > 1 ? `0.${"0".repeat(sd - 1)}` : "0";
}
