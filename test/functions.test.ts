import { describe, expect, test } from "vitest";
import { abs } from "../src/abs";
import { acos } from "../src/acos";
import { acosh } from "../src/acosh";
import { acot } from "../src/acot";
import { acoth } from "../src/acoth";
import { acsc } from "../src/acsc";
import { acsch } from "../src/acsch";
import { add } from "../src/add";
import { asec } from "../src/asec";
import { asech } from "../src/asech";
import { asin } from "../src/asin";
import { asinh } from "../src/asinh";
import { atan } from "../src/atan";
import { atan2 } from "../src/atan2";
import { atanh } from "../src/atanh";
import { cbrt } from "../src/cbrt";
import { ceil } from "../src/ceil";
import { clamp } from "../src/clamp";
import { cleanTrailingZeros } from "../src/cleanTrailingZeros";
import { combinations } from "../src/combinations";
import { compare } from "../src/compare";
import { cos } from "../src/cos";
import { cosh } from "../src/cosh";
import { cot } from "../src/cot";
import { coth } from "../src/coth";
import { countDigits } from "../src/countDigits";
import { cross } from "../src/cross";
import { csc } from "../src/csc";
import { csch } from "../src/csch";
import { cube } from "../src/cube";
import { divide } from "../src/divide";
import { divmod } from "../src/divmod";
import { dot } from "../src/dot";
import { e } from "../src/e";
import { equals } from "../src/equals";
import { exp } from "../src/exp";
import FixedPrecision from "../src/FixedPrecision";
import { factorial } from "../src/factorial";
import { floor } from "../src/floor";
import { fraction } from "../src/fraction";
import { fromNumber } from "../src/fromNumber";
import { fromString } from "../src/fromString";
import { gcd } from "../src/gcd";
import { getDenominator } from "../src/getDenominator";
import { getNumerator } from "../src/getNumerator";
import { greaterThan } from "../src/greaterThan";
import { greaterThanOrEqual } from "../src/greaterThanOrEqual";
import { hypot } from "../src/hypot";
import { idiv } from "../src/idiv";
import { idivmod } from "../src/idivmod";
import { isNegative } from "../src/isNegative";
import { isPositive } from "../src/isPositive";
import { isZero } from "../src/isZero";
import { lessThan } from "../src/lessThan";
import { lessThanOrEqual } from "../src/lessThanOrEqual";
import { log } from "../src/log";
import { log2 } from "../src/log2";
import { log10 } from "../src/log10";
import { logicalAnd } from "../src/logicalAnd";
import { logicalNot } from "../src/logicalNot";
import { logicalOr } from "../src/logicalOr";
import { logicalXor } from "../src/logicalXor";
import { max } from "../src/max";
import { min } from "../src/min";
import { mod } from "../src/mod";
import { multiply } from "../src/multiply";
import { naturalLog } from "../src/naturalLog";
import { neg } from "../src/neg";
import { notEquals } from "../src/notEquals";
import { permutations } from "../src/permutations";
import { phi } from "../src/phi";
import { pi } from "../src/pi";
import { pow } from "../src/pow";
import { power } from "../src/power";
import { powerOfTen } from "../src/powerOfTen";
import { precision } from "../src/precision";
import { precisionPowerOfTen } from "../src/precisionPowerOfTen";
import { random } from "../src/random";
import { round } from "../src/round";
import { roundToScale } from "../src/roundToScale";
import { scale } from "../src/scale";
import { sec } from "../src/sec";
import { sech } from "../src/sech";
import { shiftedBy } from "../src/shiftedBy";
import { sign } from "../src/sign";
import { significantDigits } from "../src/significantDigits";
import { sin } from "../src/sin";
import { sinh } from "../src/sinh";
import { sqrt } from "../src/sqrt";
import { sqrt2 } from "../src/sqrt2";
import { square } from "../src/square";
import { subtract } from "../src/subtract";
import { sum } from "../src/sum";
import { tan } from "../src/tan";
import { tanh } from "../src/tanh";
import { toBase } from "../src/toBase";
import { toExponential } from "../src/toExponential";
import { toFixed } from "../src/toFixed";
import { toNumber } from "../src/toNumber";
import { toPrecision } from "../src/toPrecision";
// biome-ignore lint/suspicious/noShadowRestrictedNames: nome da API pública
import { toString } from "../src/toString";
import { trunc } from "../src/trunc";

describe("functions: arithmetic", () => {
  test("add follows the date-fns example", () => {
    const result = add(new FixedPrecision("10.50"), new FixedPrecision("2.25"));
    expect(result.toString()).toBe("12.75");
  });

  test("subtract follows the date-fns example", () => {
    const result = subtract(
      new FixedPrecision("10.50"),
      new FixedPrecision("2.25"),
    );
    expect(result.toString()).toBe("8.25");
  });

  test("add accepts FixedPrecisionValue operands", () => {
    expect(add("10.50", "2.25").toString()).toBe("12.75");
    expect(add("1.5", 0.5).toString()).toBe("2");
    expect(add("2", new FixedPrecision("3")).toString()).toBe("5");
  });

  test("multiply keeps BigInt precision", () => {
    expect(multiply("10.5", "2").toString()).toBe("21");
    expect(multiply("0.1", "0.2").toString()).toBe("0.02");
  });

  test("divide keeps BigInt precision", () => {
    expect(divide("10", "4").toString()).toBe("2.5");
    expect(divide("1", "3").toFixed(8)).toBe("0.33333333");
  });
});

describe("functions: arithmetic — powers and logs", () => {
  test("mod returns the scaled remainder", () => {
    expect(mod("10.5", "3.3").toString()).toBe("0.6");
  });

  test("pow supports positive and negative exponents", () => {
    expect(pow("2", 10).toString()).toBe("1024");
    expect(pow("2", -1).toString()).toBe("0.5");
  });

  test("sqrt and cbrt", () => {
    expect(sqrt("16").toString()).toBe("4");
    expect(sqrt("2").round(6).toString()).toBe("1.414214");
    expect(cbrt("27").toString()).toBe("3");
  });

  test("exp matches the e constant", () => {
    expect(exp("1").toFixed(8)).toBe(FixedPrecision.exp("1").toFixed(8));
  });

  test("logarithms match the class API", () => {
    expect(naturalLog("1").toString()).toBe("0");
    expect(log("8", "2").toString()).toBe("3");
    expect(log2("8").toString()).toBe("3");
    expect(log10("1000").toString()).toBe("3");
  });
});

describe("functions: arithmetic — rounding and scaling", () => {
  test("round, ceil, floor and trunc", () => {
    expect(round("2.567", 2).toString()).toBe("2.57");
    expect(ceil("1.2").toString()).toBe("2");
    expect(floor("1.8").toString()).toBe("1");
    expect(trunc("1.9").toString()).toBe("1");
    expect(trunc("-1.9").toString()).toBe("-1");
  });

  test("roundToScale and scale", () => {
    expect(roundToScale("1.005", 2).toString()).toBe("1.01");
    expect(scale("1.23456789", 2).toString()).toBe("1.23");
  });

  test("shiftedBy, neg, abs and sign", () => {
    expect(shiftedBy("1.5", 2).toString()).toBe("150");
    expect(neg("-5").toString()).toBe("5");
    expect(abs("-5").toString()).toBe("5");
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
    expect(clamp("5", "0", "10").toString()).toBe("5");
    expect(clamp("-5", "0", "10").toString()).toBe("0");
    expect(clamp("15", "0", "10").toString()).toBe("10");
  });

  test("integer division variants", () => {
    expect(idiv("10", "3").toString()).toBe("3");
    const expectedDivmod = new FixedPrecision("10").divmod("3");
    expect(divmod("10", "3").quotient.toString()).toBe(
      expectedDivmod.quotient.toString(),
    );
    expect(divmod("10", "3").remainder.toString()).toBe(
      expectedDivmod.remainder.toString(),
    );
    expect(idivmod("10", "3").quotient.toString()).toBe("3");
    expect(idivmod("10", "3").remainder.toString()).toBe("1");
  });

  test("square and cube", () => {
    expect(square("3").toString()).toBe("9");
    expect(cube("2").toString()).toBe("8");
  });
});

describe("functions: bigint utilities", () => {
  test("gcd, power, powerOfTen and precisionPowerOfTen", () => {
    expect(gcd(48n, 36n)).toBe(12n);
    expect(power(2n, 10, 1n)).toBe(1024n);
    expect(powerOfTen(3)).toBe(1000n);
    expect(precisionPowerOfTen(21)).toBe(10n ** 21n);
  });

  test("cleanTrailingZeros and countDigits", () => {
    expect(cleanTrailingZeros(1200n)).toEqual({ n: 12n, c: 2 });
    expect(countDigits(12345n)).toBe(5);
  });
});

describe("functions: trigonometry", () => {
  test("sin, cos and tan at zero", () => {
    expect(sin("0").toString()).toBe("0");
    expect(cos("0").toString()).toBe("1");
    expect(tan("0").toString()).toBe("0");
  });

  test("sec, csc and cot match the class API", () => {
    expect(sec("0").toString()).toBe("1");
    expect(csc("1").toString()).toBe(FixedPrecision.csc("1").toString());
    expect(cot("1").toString()).toBe(FixedPrecision.cot("1").toString());
  });

  test("hyperbolic functions match the class API", () => {
    expect(sinh("0").toString()).toBe("0");
    expect(cosh("0").toString()).toBe("1");
    expect(tanh("0").toString()).toBe("0");
    expect(sech("0").toString()).toBe("1");
    expect(csch("1").toString()).toBe(FixedPrecision.csch("1").toString());
    expect(coth("1").toString()).toBe(FixedPrecision.coth("1").toString());
  });

  test("inverse trigonometric functions match the class API", () => {
    expect(asin("0").toString()).toBe("0");
    expect(acos("1").toString()).toBe("0");
    expect(atan("0").toString()).toBe("0");
    expect(atan2("1", "1").round(8).toString()).toBe("0.78539816");
    expect(acot("1").toString()).toBe(FixedPrecision.acot("1").toString());
    expect(asec("1").toString()).toBe("0");
    expect(acsc("1").toString()).toBe(FixedPrecision.acsc("1").toString());
  });

  test("inverse hyperbolic functions match the class API", () => {
    expect(asinh("0").toString()).toBe("0");
    expect(acosh("1").toString()).toBe("0");
    expect(atanh("0").toString()).toBe("0");
    expect(asech("1").toString()).toBe("0");
    expect(acsch("1").toString()).toBe(FixedPrecision.acsch("1").toString());
    expect(acoth("2").toString()).toBe(FixedPrecision.acoth("2").toString());
  });
});

describe("functions: statistics", () => {
  test("min, max and sum", () => {
    expect(min("3", "1", "2").toString()).toBe("1");
    expect(max("3", "1", "2").toString()).toBe("3");
    expect(sum("1", "2", "3").toString()).toBe("6");
    expect(sum(["1", "2", "3"]).toString()).toBe("6");
  });

  test("hypot", () => {
    expect(hypot("3", "4").toString()).toBe("5");
  });
});

describe("functions: combinatorics", () => {
  test("factorial, permutations and combinations", () => {
    expect(factorial(5).toString()).toBe("120");
    expect(permutations(5, 2).toString()).toBe("20");
    expect(combinations(5, 2).toString()).toBe("10");
  });
});

describe("functions: matrix", () => {
  test("dot and cross", () => {
    expect(dot(["1", "2", "3"], ["4", "5", "6"]).toString()).toBe("32");
    expect(
      cross(["1", "0", "0"], ["0", "1", "0"]).map((v) => v.toString()),
    ).toEqual(["0", "0", "1"]);
  });
});

describe("functions: fraction", () => {
  test("fraction, getNumerator and getDenominator", () => {
    expect(fraction("0.75").map((v) => v.toString())).toEqual(["3", "4"]);
    expect(getNumerator("0.75").toString()).toBe("3");
    expect(getDenominator("0.75").toString()).toBe("4");
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
    expect(fromNumber(1.5).toString()).toBe("1.5");
    expect(toNumber("1.5")).toBe(1.5);
  });
});

describe("functions: string", () => {
  test("fromString and toString", () => {
    expect(fromString("2.5").toString()).toBe("2.5");
    expect(toString("1.50")).toBe("1.5");
    expect(toString("1.50", false)).toBe("1.50000000");
  });

  test("toBase matches toHex", () => {
    expect(toBase("255", 16)).toBe(new FixedPrecision("255").toHex());
    expect(toBase("10", 2)).toBe(new FixedPrecision("10").toBinary());
  });

  test("toFixed, toExponential and toPrecision", () => {
    expect(toFixed("123.456", 2)).toBe("123.46");
    expect(toExponential("123456", 2)).toBe(
      new FixedPrecision("123456").toExponential(2),
    );
    expect(toPrecision("12345", 3)).toBe(
      new FixedPrecision("12345").toPrecision(3),
    );
  });
});

describe("functions: constants and random", () => {
  test("constants keep 8 places by default", () => {
    expect(pi().toString()).toBe("3.14159265");
    expect(e().toString()).toBe("2.71828182");
    expect(phi().toString()).toBe("1.61803398");
    expect(sqrt2().toString()).toBe("1.41421356");
  });

  test("random returns a value within the requested scale", () => {
    const value = random(5);
    expect(value.places()).toBe(5);
    expect(value.gte("0")).toBe(true);
    expect(value.lt("1")).toBe(true);
  });
});
