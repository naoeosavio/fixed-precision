import { describe, expect, test } from "vitest";
import type { RoundingMode } from "../src/core/construction/types";
import FixedPrecision from "../src/FixedPrecision";
import { abs } from "../src/FP/arithmetic/abs";
import { add } from "../src/FP/arithmetic/add";
import { cbrt } from "../src/FP/arithmetic/cbrt";
import { ceil } from "../src/FP/arithmetic/ceil";
import { clamp } from "../src/FP/arithmetic/clamp";
import { cube } from "../src/FP/arithmetic/cube";
import { divide } from "../src/FP/arithmetic/divide";
import { divmod } from "../src/FP/arithmetic/divmod";
import { exp } from "../src/FP/arithmetic/exp";
import { floor } from "../src/FP/arithmetic/floor";
import { hypot } from "../src/FP/arithmetic/hypot";
import { idiv } from "../src/FP/arithmetic/idiv";
import { idivmod } from "../src/FP/arithmetic/idivmod";
import { log } from "../src/FP/arithmetic/log";
import { log2 } from "../src/FP/arithmetic/log2";
import { log10 } from "../src/FP/arithmetic/log10";
import { mod } from "../src/FP/arithmetic/mod";
import { multiply } from "../src/FP/arithmetic/multiply";
import { naturalLog } from "../src/FP/arithmetic/naturalLog";
import { neg } from "../src/FP/arithmetic/neg";
import { pow } from "../src/FP/arithmetic/pow";
import { precision } from "../src/FP/arithmetic/precision";
import { round } from "../src/FP/arithmetic/round";
import { root } from "../src/FP/arithmetic/root";
import { scale } from "../src/FP/arithmetic/scale";
import { shiftedBy } from "../src/FP/arithmetic/shiftedBy";
import { sign } from "../src/FP/arithmetic/sign";
import { significantDigits } from "../src/FP/arithmetic/significantDigits";
import { sqrt } from "../src/FP/arithmetic/sqrt";
import { square } from "../src/FP/arithmetic/square";
import { subtract } from "../src/FP/arithmetic/subtract";
import { toNearest } from "../src/FP/arithmetic/toNearest";
import { trunc } from "../src/FP/arithmetic/trunc";
import { combinations } from "../src/FP/combinatorics/combinations";
import { factorial } from "../src/FP/combinatorics/factorial";
import { permutations } from "../src/FP/combinatorics/permutations";
import { e } from "../src/FP/constants/e";
import { phi } from "../src/FP/constants/phi";
import { pi } from "../src/FP/constants/pi";
import { sqrt2 } from "../src/FP/constants/sqrt2";
import { createFactory } from "../src/FP/construction/createFactory";
import { dataOf } from "../src/FP/construction/dataOf";
import { getDefaultContext } from "../src/FP/construction/value";
import { fraction } from "../src/FP/fractions/fraction";
import { getDenominator } from "../src/FP/fractions/getDenominator";
import { getNumerator } from "../src/FP/fractions/getNumerator";
import { isNegative } from "../src/FP/logical/isNegative";
import { isPositive } from "../src/FP/logical/isPositive";
import { isZero } from "../src/FP/logical/isZero";
import { logicalAnd } from "../src/FP/logical/logicalAnd";
import { logicalNot } from "../src/FP/logical/logicalNot";
import { logicalOr } from "../src/FP/logical/logicalOr";
import { logicalXor } from "../src/FP/logical/logicalXor";
import { cross } from "../src/FP/matrix/cross";
import { dot } from "../src/FP/matrix/dot";
import { fromNumber } from "../src/FP/numeric/fromNumber";
import { toNumber } from "../src/FP/numeric/toNumber";
import { random } from "../src/FP/probability/random";
import { compare } from "../src/FP/relational/compare";
import { equals } from "../src/FP/relational/equals";
import { greaterThan } from "../src/FP/relational/greaterThan";
import { greaterThanOrEqual } from "../src/FP/relational/greaterThanOrEqual";
import { lessThan } from "../src/FP/relational/lessThan";
import { lessThanOrEqual } from "../src/FP/relational/lessThanOrEqual";
import { notEquals } from "../src/FP/relational/notEquals";
import { max } from "../src/FP/statistics/max";
import { min } from "../src/FP/statistics/min";
import { sum } from "../src/FP/statistics/sum";
import { fromString } from "../src/FP/string/fromString";
import { toBase } from "../src/FP/string/toBase";
import { toExponential } from "../src/FP/string/toExponential";
import { toFixed } from "../src/FP/string/toFixed";
import { toPrecision } from "../src/FP/string/toPrecision";
import { stringify } from "../src/FP/string/stringify";
import { acos } from "../src/FP/trigonometry/acos";
import { acosh } from "../src/FP/trigonometry/acosh";
import { acot } from "../src/FP/trigonometry/acot";
import { acoth } from "../src/FP/trigonometry/acoth";
import { acsc } from "../src/FP/trigonometry/acsc";
import { acsch } from "../src/FP/trigonometry/acsch";
import { asec } from "../src/FP/trigonometry/asec";
import { asech } from "../src/FP/trigonometry/asech";
import { asin } from "../src/FP/trigonometry/asin";
import { asinh } from "../src/FP/trigonometry/asinh";
import { atan } from "../src/FP/trigonometry/atan";
import { atan2 } from "../src/FP/trigonometry/atan2";
import { atanh } from "../src/FP/trigonometry/atanh";
import { cos } from "../src/FP/trigonometry/cos";
import { cosh } from "../src/FP/trigonometry/cosh";
import { cot } from "../src/FP/trigonometry/cot";
import { coth } from "../src/FP/trigonometry/coth";
import { csc } from "../src/FP/trigonometry/csc";
import { csch } from "../src/FP/trigonometry/csch";
import { sec } from "../src/FP/trigonometry/sec";
import { sech } from "../src/FP/trigonometry/sech";
import { sin } from "../src/FP/trigonometry/sin";
import { sinh } from "../src/FP/trigonometry/sinh";
import { tan } from "../src/FP/trigonometry/tan";
import { tanh } from "../src/FP/trigonometry/tanh";

describe("functions: arithmetic", () => {
  test("add follows the date-fns example", () => {
    expect(stringify(add("10.50", "2.25"))).toBe("12.75");
  });

  test("subtract follows the date-fns example", () => {
    expect(stringify(subtract("10.50", "2.25"))).toBe("8.25");
  });

  test("add accepts FixedPrecisionValue operands", () => {
    expect(stringify(add("10.50", "2.25"))).toBe("12.75");
    expect(stringify(add("1.5", 0.5))).toBe("2");
    expect(stringify(add("2", dataOf(new FixedPrecision("3"))))).toBe("5");
  });

  test("multiply keeps BigInt precision", () => {
    expect(stringify(multiply("10.5", "2"))).toBe("21");
    expect(stringify(multiply("0.1", "0.2"))).toBe("0.02");
  });

  test("divide keeps BigInt precision", () => {
    expect(stringify(divide("10", "4"))).toBe("2.5");
    expect(toFixed(divide("1", "3"), { places: 8 })).toBe("0.33333333");
  });

  test("functions are lenient across different precisions", () => {
    const FP8 = createFactory({ places: 8 });
    const FP4 = createFactory({ places: 4 });

    expect(stringify(add(FP8("1.23456789"), FP4("2.5")))).toBe("3.73456789");
    expect(equals(FP8("1.5"), FP4("1.5"))).toBe(true);
    expect(compare(FP8("2"), FP4("1"))).toBe(1);
    expect(stringify(FP4("1.5"))).toBe("1.5");
  });

  test("instance methods keep strict context checks", () => {
    const FP8 = FixedPrecision.create({ places: 8 });
    const FP4 = FixedPrecision.create({ places: 4 });

    expect(() => FP8("1").add(FP4("1"))).toThrow(
      "Cannot operate on different precisions",
    );
  });
});

describe("functions: factories", () => {
  test("createFactory fixes the places of every produced value", () => {
    const FP20 = createFactory({ places: 20 });

    expect(FP20("1.1").places).toBe(20);
    expect(stringify(add(FP20("1.1"), FP20("2.2")))).toBe("3.3");
    expect(add(FP20("1.1"), FP20("2.2")).places).toBe(20);
  });

  test("createFactory applies the configured rounding mode", () => {
    const FP3 = createFactory({ places: 3, roundingMode: 6 });

    expect(stringify(scale(FP3("1.005"), { places: 2, roundingMode: 6 }))).toBe(
      "1",
    );
    expect(stringify(scale(FP3("1.015"), { places: 2, roundingMode: 6 }))).toBe(
      "1.02",
    );
  });

  test("createFactory is lenient when mixed with other precisions", () => {
    const FP20 = createFactory({ places: 20 });
    const FP4 = createFactory({ places: 4 });

    expect(add(FP20("1.23456789"), FP4("2.5")).places).toBe(20);
    expect(stringify(add(FP20("1.23456789"), FP4("2.5")))).toBe("3.73456789");
  });

  test("createFactory rejects invalid configs", () => {
    expect(() => createFactory({ places: 21 })).toThrow(
      "Decimal places must be an integer between 0 and 20",
    );
    expect(() =>
      createFactory({ places: 2, roundingMode: 9 as RoundingMode }),
    ).toThrow("Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8");
  });
});

describe("functions: arithmetic — powers and logs", () => {
  test("mod returns the scaled remainder", () => {
    expect(stringify(mod("10.5", "3.3"))).toBe("0.6");
  });

  test("pow supports positive and negative exponents", () => {
    expect(stringify(pow("2", 10))).toBe("1024");
    expect(stringify(pow("2", -1))).toBe("0.5");
  });

  test("sqrt and cbrt", () => {
    expect(stringify(sqrt("16"))).toBe("4");
    expect(stringify(round(sqrt("2"), { places: 6 }))).toBe("1.414214");
    expect(stringify(cbrt("27"))).toBe("3");
  });

  test("root generalizes sqrt and cbrt", () => {
    expect(stringify(root("16", 2))).toBe("4");
    expect(stringify(root("2", 2))).toBe(stringify(sqrt("2")));
    expect(stringify(root("27", 3))).toBe("3");
    expect(stringify(root("16", 4))).toBe("2");
    expect(stringify(root("-8", 3))).toBe("-2");
  });

  test("exp matches the e constant", () => {
    expect(toFixed(exp("1"), { places: 8 })).toBe(
      FixedPrecision.exp("1").toFixed(8),
    );
  });

  test("logarithms match the class API", () => {
    expect(stringify(naturalLog("1"))).toBe("0");
    expect(stringify(log("8", { base: "2" }))).toBe("3");
    expect(stringify(log2("8"))).toBe("3");
    expect(stringify(log10("1000"))).toBe("3");
  });
});

describe("functions: arithmetic — rounding and scaling", () => {
  test("round, ceil, floor and trunc", () => {
    expect(stringify(round("2.567", { places: 2 }))).toBe("2.57");
    expect(stringify(ceil("1.2"))).toBe("2");
    expect(stringify(floor("1.8"))).toBe("1");
    expect(stringify(trunc("1.9"))).toBe("1");
    expect(stringify(trunc("-1.9"))).toBe("-1");
  });

  test("scale", () => {
    expect(stringify(scale("1.005", { places: 2 }))).toBe("1.01");
    expect(stringify(scale("1.23456789", { places: 2 }))).toBe("1.23");
  });

  test("shiftedBy, neg, abs and sign", () => {
    expect(stringify(shiftedBy("1.5", 2))).toBe("150");
    expect(stringify(neg("-5"))).toBe("5");
    expect(stringify(abs("-5"))).toBe("5");
    expect(sign("-5")).toBe(-1);
    expect(sign("0")).toBe(0);
    expect(sign("3.14")).toBe(1);
  });

  test("precision and significantDigits", () => {
    expect(precision("123")).toBe(3);
    expect(precision("12.34")).toBe(4);
    expect(significantDigits("12.34")).toBe(4);
  });
});

describe("functions: arithmetic — division and unary", () => {
  test("clamp bounds the value", () => {
    expect(stringify(clamp("5", "0", "10"))).toBe("5");
    expect(stringify(clamp("-5", "0", "10"))).toBe("0");
    expect(stringify(clamp("15", "0", "10"))).toBe("10");
  });

  test("integer division variants", () => {
    expect(stringify(idiv("10", "3"))).toBe("3");
    const expectedDivmod = new FixedPrecision("10").divmod("3");
    expect(stringify(divmod("10", "3").quotient)).toBe(
      expectedDivmod.quotient.toString(),
    );
    expect(stringify(divmod("10", "3").remainder)).toBe(
      expectedDivmod.remainder.toString(),
    );
    expect(stringify(idivmod("10", "3").quotient)).toBe("3");
    expect(stringify(idivmod("10", "3").remainder)).toBe("1");
  });

  test("square and cube", () => {
    expect(stringify(square("3"))).toBe("9");
    expect(stringify(cube("2"))).toBe("8");
  });
});

describe("functions: trigonometry", () => {
  test("sin, cos and tan at zero", () => {
    expect(stringify(sin("0"))).toBe("0");
    expect(stringify(cos("0"))).toBe("1");
    expect(stringify(tan("0"))).toBe("0");
  });

  test("sec, csc and cot match the class API", () => {
    expect(stringify(sec("0"))).toBe("1");
    expect(stringify(csc("1"))).toBe(FixedPrecision.csc("1").toString());
    expect(stringify(cot("1"))).toBe(FixedPrecision.cot("1").toString());
  });

  test("hyperbolic functions match the class API", () => {
    expect(stringify(sinh("0"))).toBe("0");
    expect(stringify(cosh("0"))).toBe("1");
    expect(stringify(tanh("0"))).toBe("0");
    expect(stringify(sech("0"))).toBe("1");
    expect(stringify(csch("1"))).toBe(FixedPrecision.csch("1").toString());
    expect(stringify(coth("1"))).toBe(FixedPrecision.coth("1").toString());
  });

  test("inverse trigonometric functions match the class API", () => {
    expect(stringify(asin("0"))).toBe("0");
    expect(stringify(acos("1"))).toBe("0");
    expect(stringify(atan("0"))).toBe("0");
    expect(stringify(round(atan2("1", "1"), { places: 8 }))).toBe(
      "0.78539816",
    );
    expect(stringify(acot("1"))).toBe(FixedPrecision.acot("1").toString());
    expect(stringify(asec("1"))).toBe("0");
    expect(stringify(acsc("1"))).toBe(FixedPrecision.acsc("1").toString());
  });

  test("inverse hyperbolic functions match the class API", () => {
    expect(stringify(asinh("0"))).toBe("0");
    expect(stringify(acosh("1"))).toBe("0");
    expect(stringify(atanh("0"))).toBe("0");
    expect(stringify(asech("1"))).toBe("0");
    expect(stringify(acsch("1"))).toBe(FixedPrecision.acsch("1").toString());
    expect(stringify(acoth("2"))).toBe(FixedPrecision.acoth("2").toString());
  });
});

describe("functions: statistics", () => {
  test("min, max and sum", () => {
    expect(stringify(min("3", "1", "2"))).toBe("1");
    expect(stringify(max("3", "1", "2"))).toBe("3");
    expect(stringify(sum("1", "2", "3"))).toBe("6");
    expect(stringify(sum(["1", "2", "3"]))).toBe("6");
  });

  test("hypot", () => {
    expect(stringify(hypot("3", "4"))).toBe("5");
  });
});

describe("functions: combinatorics", () => {
  test("factorial, permutations and combinations", () => {
    expect(stringify(factorial(5))).toBe("120");
    expect(stringify(permutations(5, 2))).toBe("20");
    expect(stringify(combinations(5, 2))).toBe("10");
  });
});

describe("functions: matrix", () => {
  test("dot and cross", () => {
    expect(stringify(dot(["1", "2", "3"], ["4", "5", "6"]))).toBe("32");
    expect(
      cross(["1", "0", "0"], ["0", "1", "0"]).map((v) => stringify(v)),
    ).toEqual(["0", "0", "1"]);
  });
});

describe("functions: fraction", () => {
  test("fraction, getNumerator and getDenominator", () => {
    expect(fraction("0.75").map((v) => stringify(v))).toEqual(["3", "4"]);
    expect(stringify(getNumerator("0.75"))).toBe("3");
    expect(stringify(getDenominator("0.75"))).toBe("4");
  });
});

describe("functions: logical", () => {
  test("isZero, isPositive and isNegative", () => {
    expect(isZero("0")).toBe(true);
    expect(isZero("1")).toBe(false);
    expect(isPositive("1")).toBe(true);
    expect(isNegative("-1")).toBe(true);
  });

  test("logical operations", () => {
    expect(logicalNot("0")).toBe(true);
    expect(logicalAnd("1", "1")).toBe(true);
    expect(logicalOr("0", "0")).toBe(false);
    expect(logicalXor("1", "0")).toBe(true);
  });
});

describe("functions: relational", () => {
  test("compare", () => {
    expect(compare("1", "2")).toBe(-1);
    expect(compare("2", "1")).toBe(1);
    expect(compare("1", "1")).toBe(0);
  });

  test("equals and notEquals", () => {
    expect(equals("1.5", 1.5)).toBe(true);
    expect(equals("1.5", "1.50")).toBe(true);
    expect(notEquals("1", "2")).toBe(true);
  });

  test("ordering predicates", () => {
    expect(greaterThan("2", "1")).toBe(true);
    expect(greaterThanOrEqual("1", "1")).toBe(true);
    expect(lessThan("1", "2")).toBe(true);
    expect(lessThanOrEqual("2", "2")).toBe(true);
  });
});

describe("functions: numeric", () => {
  test("fromNumber and toNumber", () => {
    expect(stringify(fromNumber(1.5))).toBe("1.5");
    expect(toNumber("1.5")).toBe(1.5);
  });
});

describe("functions: string", () => {
  test("fromString and toString", () => {
    expect(stringify(fromString("2.5"))).toBe("2.5");
    expect(stringify("1.50")).toBe("1.5");
    expect(stringify("1.50", false)).toBe("1.50000000");
  });

  test("toBase matches toHex", () => {
    expect(toBase("255", 16)).toBe(new FixedPrecision("255").toHex());
    expect(toBase("10", 2)).toBe(new FixedPrecision("10").toBinary());
  });

  test("toFixed, toExponential and toPrecision", () => {
    expect(toFixed("123.456", { places: 2 })).toBe("123.46");
    expect(toExponential("123456", { places: 2 })).toBe(
      new FixedPrecision("123456").toExponential(2),
    );
    expect(toPrecision("12345", { sd: 3 })).toBe(
      new FixedPrecision("12345").toPrecision(3),
    );
  });
});

describe("functions: constants and random", () => {
  test("constants keep 8 places by default", () => {
    expect(stringify(pi())).toBe("3.14159265");
    expect(stringify(e())).toBe("2.71828183");
    expect(stringify(phi())).toBe("1.61803399");
    expect(stringify(sqrt2())).toBe("1.41421356");
  });

  test("random returns a value within the requested scale", () => {
    const value = random({ places: 5 });
    expect(value.places).toBe(5);
    expect(greaterThanOrEqual(value, "0")).toBe(true);
    expect(lessThan(value, "1")).toBe(true);
  });
});

describe("functions: dataOf", () => {
  test("primitive uses the default context", () => {
    expect(dataOf("1.5")).toEqual({
      places: 8,
      roundingMode: 4,
      SCALE: 100000000n,
      SCALENUMBER: 100000000,
      value: 150000000n,
    });
  });

  test("instance converts through the class → functional bridge", () => {
    const FP4 = FixedPrecision.create({ places: 4 });
    const instance = FP4("1.5");
    expect(dataOf(instance)).toEqual({
      places: 4,
      roundingMode: 4,
      SCALE: 10000n,
      SCALENUMBER: 10000,
      value: 15000n,
    });
  });

  test("number uses the default context", () => {
    expect(dataOf(1.5)).toEqual({
      places: 8,
      roundingMode: 4,
      SCALE: 100000000n,
      SCALENUMBER: 100000000,
      value: 150000000n,
    });
  });

  test("data passes through unchanged", () => {
    const data = createFactory({ places: 4 })("1.5");
    expect(dataOf(data)).toEqual(data);
  });
});

describe("functions: options object", () => {
  test("round uses places and roundingMode from options", () => {
    expect(stringify(round("2.567", { places: 2 }))).toBe("2.57");
    expect(stringify(round("2.567", { places: 1, roundingMode: 1 }))).toBe(
      "2.5",
    );
    expect(stringify(round("2.567"))).toBe(stringify(round("2.567", {})));
  });

  test("scale requires places and accepts roundingMode", () => {
    expect(scale("1.23456789", { places: 2 }).places).toBe(2);
    expect(scale("9.99", { places: 0, roundingMode: 4 }).value).toBe(10n);
  });

  test("toNearest accepts optional roundingMode", () => {
    expect(toNearest("3.14159", "0.01").value).toBe(314000000n);
    expect(
      toNearest("3.14159", "0.01", { roundingMode: 4 }).value,
    ).toBe(toNearest("3.14159", "0.01").value);
  });

  test("log takes base only via options", () => {
    expect(log("8", { base: "2" }).value).toBe(300000000n);
    const two = createFactory({ places: 8 })("2");
    expect(log("8", { base: two }).value).toBe(300000000n);
    expect(log("8").value).toBe(naturalLog("8").value);
  });

  test("toFixed takes places and roundingMode via options", () => {
    expect(toFixed("123.456", { places: 2 })).toBe("123.46");
    expect(toFixed("123.456")).toBe(toFixed("123.456", {}));
  });

  test("toExponential takes places via options", () => {
    expect(toExponential("123456", { places: 2 })).toBe(
      new FixedPrecision("123456").toExponential(2),
    );
  });

  test("toPrecision requires sd and accepts roundingMode", () => {
    expect(toPrecision("12345", { sd: 3 })).toBe(
      new FixedPrecision("12345").toPrecision(3),
    );
    expect(toPrecision("12345", { sd: 3, roundingMode: 1 })).toBe(
      new FixedPrecision("12345").toPrecision(3, 1),
    );
  });

  test("toBase keeps base positional and sd/roundingMode in options", () => {
    expect(toBase("255", 16, { sd: 8 })).toBe(new FixedPrecision("255").toHex());
    expect(toBase("255", 16, {})).toBe(toBase("255", 16));
  });

  test("toNumber takes places via options", () => {
    const data = createFactory({ places: 4 })("1.23456789");
    expect(toNumber(data)).toBeCloseTo(1.2346);
    expect(toNumber(data, { places: 2 })).toBeCloseTo(1.23);
    expect(toNumber("1.5", { places: 3 })).toBe(1.5);
  });

  test("fraction takes maxDen via options", () => {
    const [n, d] = fraction("0.125", { maxDen: "100" });
    expect([n.value, d.value]).toEqual([100000000n, 800000000n]);
  });

  test("random takes places via options", () => {
    expect(random({ places: 3 }).places).toBe(3);
    expect(random().places).toBe(getDefaultContext().places);
    expect(random({}).places).toBe(getDefaultContext().places);
  });

  test("default context is frozen and stable", () => {
    const ctx = getDefaultContext();
    expect(Object.isFrozen(ctx)).toBe(true);
    expect(ctx.places).toBe(8);
    expect(ctx.roundingMode).toBe(4);
    expect(getDefaultContext()).toBe(ctx);
  });
});
