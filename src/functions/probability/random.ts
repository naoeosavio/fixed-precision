export function randomDecimalString(decimalPlaces: number): string {
  const max = 10 ** decimalPlaces;
  const randInt = Math.floor(Math.random() * max);
  const fracStr = randInt.toString().padStart(decimalPlaces, "0");
  return `0.${fracStr}`;
}
