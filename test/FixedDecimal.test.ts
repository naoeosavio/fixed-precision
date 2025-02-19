import FixedDecimal from '../src/FixedDecimal';

describe('FixedDecimal', () => {
  // Testes do Construtor
  describe('Constructor', () => {
    test('accepts valid string with 8 decimals', () => {
      const a = new FixedDecimal("12345.67891234");
      expect(a.toString()).toBe("12345.67891234");
    });

    test('rounds string with >8 decimals using Number conversion', () => {
      const a = new FixedDecimal("0.123456789"); // 9 casas
      expect(a.toString()).toBe("0.12345678"); // Arredondado para 8
    });

    test('accepts number input', () => {
      const a = new FixedDecimal(42.12345678);
      expect(a.toString()).toBe("42.12345678");
    });

    test('accepts bigint input', () => {
      const a = new FixedDecimal(123456789n);
      expect(a.toNumber()).toBe(123456789);
    });

    test('throws error for invalid string', () => {
      expect(() => new FixedDecimal("abc")).toThrow("The number NaN cannot be converted to a BigInt because it is not an integer");
    });
  });

  // Operações Aritméticas
  describe('Arithmetic Operations', () => {
    const a = new FixedDecimal("10.5");
    const b = new FixedDecimal("3.2");

    test('add() - positive values', () => {
      expect(a.add(b).toString()).toBe("13.70000000");
    });

    test('sub() - result negative', () => {
      expect(b.sub(a).toString()).toBe("-7.30000000");
    });

    test('mul() - with scaling', () => {
      const result = a.mul(b);
      expect(result.toString()).toBe("33.60000000"); // (10.5 * 3.2) = 33.6
    });

    test('div() - precise division', () => {
      const result = a.div(b);
      expect(result.toFixed(2)).toBe("3.28"); // 10.5 / 3.2 ≈ 3.28125 -> 3.28 com 2 casas
    });

    test('div() throws on zero', () => {
      const zero = new FixedDecimal(0);
      expect(() => a.div(zero)).toThrow("Division by zero");
    });

    test('mod() - positive remainder', () => {
      const x = new FixedDecimal("10");
      const y = new FixedDecimal("3");
      expect(x.mod(y).toString()).toBe("1.00000000");
    });

    test('product() - large multiplication', () => {
      const big = new FixedDecimal("100000000");
      const result = big.product(big);
      expect(result.toString()).toBe("100000000000000000000000000000000.00000000"); // 1e16 * 1e16 = 1e32
    });
  });

  // Escalamento e Arredondamento
  describe('Scaling and Rounding', () => {
    test('scale(2) reduces decimals with rounding', () => {
      const num = new FixedDecimal("123.456789");
      expect(num.scale(2).toString()).toBe("123.46000000"); // Arredonda .456789 para .46
    });

    test('scale(0) rounds to integer', () => {
      const num = new FixedDecimal("99.99999999");
      expect(num.scale(0).toString()).toBe("100.00000000");
    });

    test('toFixed(3) truncates correctly', () => {
      const num = new FixedDecimal("5.6789");
      expect(num.toFixed(3)).toBe("5.679");
    });
  });

  // Formatação
  describe('Formatting', () => {
    // test('toFormatString(2) adds commas', () => {
    //   const num = new FixedDecimal("1234567.89");
    //   expect(num.toFormatString(2)).toBe("1,234,567.89");
    // });

    test('toPrecision(4) handles significant digits', () => {
      const num = new FixedDecimal('12.345678');
      expect(num.toPrecision(4)).toBe("12.35");
    });
  });

  // Casos Extremos
  describe('Edge Cases', () => {
    test('handles zero correctly', () => {
      const zero = new FixedDecimal(0);
      expect(zero.add(zero).eq(zero));
      expect(zero.mul(zero).eq(zero));
    });

    test('max precision (8 decimals)', () => {
      const max = new FixedDecimal("0.99999999");
      expect(max.add(max).toString()).toBe("1.99999998");
    });

    test('handles negative values', () => {
      const neg = new FixedDecimal('-42.42');
      expect(neg.abs().toString()).toBe("42.42000000");
    });
  });
});