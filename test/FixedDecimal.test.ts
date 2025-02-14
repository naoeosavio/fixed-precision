import FixedDecimal from "../src/FixedDecimal";


test('adds two decimals', () => {
  const a = new FixedDecimal("1.5");
  const b = new FixedDecimal("2.3");
  expect(a.add(b).toString()).toBe("3.8");
});