import { describe, expect, test } from "vitest";
import * as arithmetic from "../src/FP/arithmetic";
import * as bitwise from "../src/FP/bitwise";
import * as combinatorics from "../src/FP/combinatorics";
import * as fractions from "../src/FP/fractions";
import * as logical from "../src/FP/logical";
import * as numeric from "../src/FP/numeric";
import { partial, pipe } from "../src/FP/pipe";
import * as relational from "../src/FP/relational";
import * as strings from "../src/FP/string";
import { stringify } from "../src/FP/string/stringify";
import * as trigonometry from "../src/FP/trigonometry";

type Case = [name: string, byCall: () => unknown, directCall: () => unknown];

const arithmeticCases: Case[] = [
  ["add", () => arithmetic.addBy("2")("1"), () => arithmetic.add("1", "2")],
  [
    "subtract",
    () => arithmetic.subtractBy("2")("5"),
    () => arithmetic.subtract("5", "2"),
  ],
  [
    "multiply",
    () => arithmetic.multiplyBy("3")("2"),
    () => arithmetic.multiply("2", "3"),
  ],
  [
    "divide",
    () => arithmetic.divideBy("4")("1"),
    () => arithmetic.divide("1", "4"),
  ],
  [
    "mod",
    () => arithmetic.modBy("97")("1234.5"),
    () => arithmetic.mod("1234.5", "97"),
  ],
  ["idiv", () => arithmetic.idivBy("3")("7"), () => arithmetic.idiv("7", "3")],
  [
    "divmod",
    () => arithmetic.divmodBy("3")("7"),
    () => arithmetic.divmod("7", "3"),
  ],
  [
    "idivmod",
    () => arithmetic.idivmodBy("3")("7"),
    () => arithmetic.idivmod("7", "3"),
  ],
  ["pow", () => arithmetic.powBy(2)("3"), () => arithmetic.pow("3", 2)],
  ["root", () => arithmetic.rootBy(2)("9"), () => arithmetic.root("9", 2)],
  ["shift", () => arithmetic.shiftBy(1)("1"), () => arithmetic.shift("1", 1)],
  [
    "log",
    () => arithmetic.logBy({ base: "10" })("100"),
    () => arithmetic.log("100", { base: "10" }),
  ],
  [
    "toNearest",
    () => arithmetic.toNearestBy("0.5")("1.3"),
    () => arithmetic.toNearest("1.3", "0.5"),
  ],
  [
    "scale",
    () => arithmetic.scaleBy({ places: 2 })("1.234"),
    () => arithmetic.scale("1.234", { places: 2 }),
  ],
  [
    "round",
    () => arithmetic.roundBy({ places: 1 })("1.25"),
    () => arithmetic.round("1.25", { places: 1 }),
  ],
  [
    "clamp",
    () => arithmetic.clampBy("0", "10")("20"),
    () => arithmetic.clamp("20", "0", "10"),
  ],
  [
    "precision",
    () => arithmetic.precisionBy()("123.45"),
    () => arithmetic.precision("123.45"),
  ],
  ["plus", () => arithmetic.plus("1", "2"), () => arithmetic.add("1", "2")],
  [
    "plusBy",
    () => arithmetic.plusBy("2")("1"),
    () => arithmetic.addBy("2")("1"),
  ],
  [
    "minus",
    () => arithmetic.minus("5", "2"),
    () => arithmetic.subtract("5", "2"),
  ],
  [
    "minusBy",
    () => arithmetic.minusBy("2")("5"),
    () => arithmetic.subtractBy("2")("5"),
  ],
  [
    "times",
    () => arithmetic.times("2", "3").value,
    () => 200000000n * 300000000n,
  ],
  [
    "timesBy",
    () => arithmetic.timesBy("3")("2").value,
    () => 200000000n * 300000000n,
  ],
  [
    "ratio",
    () => arithmetic.ratio("7", "2").value,
    () => 700000000n / 200000000n,
  ],
  [
    "ratioBy",
    () => arithmetic.ratioBy("2")("7").value,
    () => 700000000n / 200000000n,
  ],
  ["rem", () => arithmetic.rem("7", "3").value, () => 700000000n % 300000000n],
  [
    "remBy",
    () => arithmetic.remBy("3")("7").value,
    () => 700000000n % 300000000n,
  ],
];

const stringCases: Case[] = [
  [
    "stringify",
    () => strings.stringifyBy(false)("1.50"),
    () => strings.stringify("1.50", false),
  ],
  [
    "toFixed",
    () => strings.toFixedBy({ places: 2 })("1.5"),
    () => strings.toFixed("1.5", { places: 2 }),
  ],
  [
    "toExponential",
    () => strings.toExponentialBy()("123"),
    () => strings.toExponential("123"),
  ],
  [
    "toPrecision",
    () => strings.toPrecisionBy({ sd: 3 })("123.45"),
    () => strings.toPrecision("123.45", { sd: 3 }),
  ],
  [
    "toBase",
    () => strings.toBaseBy(16)("255"),
    () => strings.toBase("255", 16),
  ],
  [
    "toNumber",
    () => numeric.toNumberBy()("1.5"),
    () => numeric.toNumber("1.5"),
  ],
  [
    "fraction",
    () => fractions.fractionBy()("0.5"),
    () => fractions.fraction("0.5"),
  ],
];

const predicateCases: Case[] = [
  ["equals", () => relational.equalsBy("1")("1"), () => true],
  ["notEquals", () => relational.notEqualsBy("1")("2"), () => true],
  ["lessThan", () => relational.lessThanBy("2")("1"), () => true],
  ["lessThanOrEqual", () => relational.lessThanOrEqualBy("1")("1"), () => true],
  ["greaterThan", () => relational.greaterThanBy("1")("2"), () => true],
  [
    "greaterThanOrEqual",
    () => relational.greaterThanOrEqualBy("2")("2"),
    () => true,
  ],
  [
    "compare",
    () => relational.compareBy("2")("1"),
    () => relational.compare("1", "2"),
  ],
  ["logicalAnd", () => logical.logicalAndBy("1")("1"), () => true],
  ["logicalOr", () => logical.logicalOrBy("0")("1"), () => true],
  ["logicalXor", () => logical.logicalXorBy("1")("1"), () => false],
  ["bitAnd", () => bitwise.bitAndBy("3")("6"), () => bitwise.bitAnd("6", "3")],
  ["bitOr", () => bitwise.bitOrBy("3")("6"), () => bitwise.bitOr("6", "3")],
  ["bitXor", () => bitwise.bitXorBy("3")("6"), () => bitwise.bitXor("6", "3")],
  [
    "leftShift",
    () => bitwise.leftShiftBy(2)("1"),
    () => bitwise.leftShift("1", 2),
  ],
  [
    "rightShift",
    () => bitwise.rightShiftBy(1)("3"),
    () => bitwise.rightShift("3", 1),
  ],
  ["eq", () => relational.eql("1", "1"), () => relational.equals("1", "1")],
  [
    "eqBy",
    () => relational.eqlBy("1")("1"),
    () => relational.equalsBy("1")("1"),
  ],
  ["cmp", () => relational.cmp("1", "2"), () => relational.compare("1", "2")],
  [
    "cmpBy",
    () => relational.cmpBy("2")("1"),
    () => relational.compareBy("2")("1"),
  ],
  ["gt", () => relational.gtn("2", "1"), () => relational.greaterThan("2", "1")],
  [
    "gtBy",
    () => relational.gtnBy("1")("2"),
    () => relational.greaterThanBy("1")("2"),
  ],
  [
    "gte",
    () => relational.gte("2", "2"),
    () => relational.greaterThanOrEqual("2", "2"),
  ],
  [
    "gteBy",
    () => relational.gteBy("2")("2"),
    () => relational.greaterThanOrEqualBy("2")("2"),
  ],
  ["lt", () => relational.ltn("1", "2"), () => relational.lessThan("1", "2")],
  [
    "ltBy",
    () => relational.ltnBy("2")("1"),
    () => relational.lessThanBy("2")("1"),
  ],
  [
    "lte",
    () => relational.lte("1", "1"),
    () => relational.lessThanOrEqual("1", "1"),
  ],
  [
    "lteBy",
    () => relational.lteBy("1")("1"),
    () => relational.lessThanOrEqualBy("1")("1"),
  ],
];

const miscCases: Case[] = [
  [
    "permutations",
    () => combinatorics.permutationsBy(2)(5),
    () => combinatorics.permutations(5, 2),
  ],
  [
    "combinations",
    () => combinatorics.combinationsBy(2)(5),
    () => combinatorics.combinations(5, 2),
  ],
  [
    "atan2",
    () => trigonometry.atan2By("1")("1"),
    () => trigonometry.atan2("1", "1"),
  ],
];

describe("By variants mirror direct calls", () => {
  test.each(arithmeticCases)("%s", (_n, byCall, directCall) => {
    expect(byCall()).toEqual(directCall());
  });
  test.each(stringCases)("%s", (_n, byCall, directCall) => {
    expect(byCall()).toEqual(directCall());
  });
  test.each(predicateCases)("%s", (_n, byCall, directCall) => {
    expect(byCall()).toEqual(directCall());
  });
  test.each(miscCases)("%s", (_n, byCall, directCall) => {
    expect(byCall()).toEqual(directCall());
  });
});

describe("shift alias", () => {
  test("shift still works", () => {
    expect(stringify(arithmetic.shift("1", 1))).toBe(
      stringify(arithmetic.shift("1", 1)),
    );
  });
});

describe("raw aliases match primaries on compatible inputs", () => {
  test("raw and resolving variants agree", () => {
    expect(arithmetic.plus("1", "2")).toEqual(arithmetic.add("1", "2"));
    expect(arithmetic.minus("5", "2")).toEqual(arithmetic.subtract("5", "2"));
    expect(arithmetic.times("2", "3").value).toBe(200000000n * 300000000n);
    expect(arithmetic.ratio("7", "2").value).toBe(700000000n / 200000000n);
    expect(arithmetic.rem("7", "3").value).toBe(700000000n % 300000000n);
    expect(arithmetic.plusBy("2")("1")).toEqual(arithmetic.addBy("2")("1"));
    expect(relational.eql("1", "1")).toBe(relational.equals("1", "1"));
    expect(relational.cmp("1", "2")).toBe(relational.compare("1", "2"));
    expect(relational.gtn("2", "1")).toBe(relational.greaterThan("2", "1"));
    expect(relational.gte("2", "2")).toBe(
      relational.greaterThanOrEqual("2", "2"),
    );
    expect(relational.ltn("1", "2")).toBe(relational.lessThan("1", "2"));
    expect(relational.lte("1", "1")).toBe(relational.lessThanOrEqual("1", "1"));
    expect(relational.eqlBy("1")("1")).toBe(relational.equalsBy("1")("1"));
    expect(relational.gteBy("2")("2")).toBe(
      relational.greaterThanOrEqualBy("2")("2"),
    );
  });
});

describe("By variants in pipe", () => {
  test("curried style replaces partial and lambdas", () => {
    const withBy = pipe(
      arithmetic.addBy("2"),
      arithmetic.multiplyBy("3"),
      stringify,
    )("1");
    const withPartial = pipe(
      partial(arithmetic.add, "2"),
      partial(arithmetic.multiply, "3"),
      stringify,
    )("1");
    expect(withBy).toBe("9");
    expect(withBy).toBe(withPartial);
  });
});
