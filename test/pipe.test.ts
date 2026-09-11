import { describe, expect, test } from "vitest";
import { add } from "../src/FP/arithmetic/add";
import { multiply } from "../src/FP/arithmetic/multiply";
import { sqrt } from "../src/FP/arithmetic/sqrt";
import { stringify } from "../src/FP/string/stringify";
import * as arithmetic from "../src/FP/arithmetic";
import * as bitwise from "../src/FP/bitwise";
import * as combinatorics from "../src/FP/combinatorics";
import * as constants from "../src/FP/constants";
import * as fractions from "../src/FP/fractions";
import type { FixedPrecisionData } from "../src/FP/construction";
import { createFactory } from "../src/FP/construction/createFactory";
import { dataOf } from "../src/FP/construction/dataOf";
import * as logical from "../src/FP/logical";
import * as matrix from "../src/FP/matrix";
import * as numeric from "../src/FP/numeric";
import FixedPrecision from "../src/FixedPrecision";
import * as pipeModule from "../src/FP/pipe";
import {
  partial,
  compose,
  pipe,
} from "../src/FP/pipe";
import * as relational from "../src/FP/relational";
import * as statistics from "../src/FP/statistics";
import * as strings from "../src/FP/string";
import * as trigonometry from "../src/FP/trigonometry";

describe("pipe + partial", () => {
  const A = pipe(
    partial(add, "2"),
    partial(multiply, "3"),
    partial(stringify),
  )("1");

  const B = pipe(
    (x: string) => add("2", x),
    (data: FixedPrecisionData) => multiply("3", data),
    stringify,
  )("1");

  const C = pipe(
    partial(add, "2"),
    (data: FixedPrecisionData) => multiply("3", data),
    stringify,
  )("1");

  test("partial, lambdas and mixed styles produce the same result", () => {
    expect(A).toBe("9");
    expect(B).toBe("9");
    expect(C).toBe("9");
  });

  test("unary standalones plug in directly", () => {
    expect(pipe(sqrt, stringify)("9")).toBe("3");
  });

  test("partial without extra arguments is a pass-through stage", () => {
    expect(pipe(partial(sqrt), stringify)("9")).toBe("3");
  });

  test("partial doubles as a reusable transform", () => {
    const tax = partial(multiply, "1.1");
    expect(stringify(tax("100"))).toBe("110");
    expect(stringify(tax("19.99"))).toBe(stringify(multiply("19.99", "1.1")));
  });

  test("factory/dataOf contexts flow through stages", () => {
    const FP2 = FixedPrecision.create({ places: 2 });
    const Money = createFactory({ places: 2 });
    const out = pipe(partial(add, "1"))(dataOf(FP2("1.5")));
    expect(out.places).toBe(2);
    expect(stringify(out)).toBe("2.5");
    expect(stringify(pipe(partial(multiply, "3"), stringify)(Money("10")))).toBe(
      "30",
    );
  });
});

describe("compose", () => {
  test("applies stages right-to-left", () => {
    const calc = compose(stringify, partial(add, "2"), sqrt);
    expect(calc("4")).toBe("4");
    expect(compose(stringify, sqrt)("9")).toBe("3");
  });

  test("mixes bound stages and lambdas like pipe", () => {
    const calc = compose(
      stringify,
      (data: FixedPrecisionData) => add("2", data),
      partial(multiply, "3"),
    );
    expect(calc("1")).toBe("5");
  });

  test("typed chains beyond 10 stages keep full type safety (4.7)", () => {
    const by1 = partial(add, "1");
    const by2 = partial(multiply, "2");
    const piped = pipe(
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
      stringify,
    );
    expect(piped("0")).toBe("63");
    const composed = compose(
      stringify,
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
      by2,
      by1,
    );
    expect(composed("0")).toBe("63");
  });

  test("tail-recursive typings survive 999 stages (5)", () => {
    type Repeat<Stage, Count extends number, Acc extends Stage[] = []> =
      Acc["length"] extends Count
        ? Acc
        : Repeat<Stage, Count, [...Acc, Stage]>;

    const by1 = partial(add, "1");
    const many_by_1 = Array.from(
      { length: 999 },
      () => by1,
    ) as unknown as Repeat<typeof by1, 999>;

    expect(stringify(pipe(...many_by_1)("0"))).toBe("999");
    expect(stringify(compose(...many_by_1)("0"))).toBe("999");
  });
});

type Fn = (...args: any[]) => any;
type Entry = [name: string, fn: Fn, extras: any[], input: any];

const registry: Entry[] = [
  ["abs", arithmetic.abs, [], "-6"],
  ["add", arithmetic.add, ["2"], "6"],
  ["cbrt", arithmetic.cbrt, [], "8"],
  ["ceil", arithmetic.ceil, [], "6.1"],
  ["clamp", arithmetic.clamp, ["1", "5"], "3"],
  ["cube", arithmetic.cube, [], "3"],
  ["divide", arithmetic.divide, ["2"], "6"],
  ["divmod", arithmetic.divmod, ["2"], "7"],
  ["exp", arithmetic.exp, [], "1"],
  ["floor", arithmetic.floor, [], "6.9"],
  ["hypot", arithmetic.hypot, [], ["3", "4"]],
  ["idiv", arithmetic.idiv, ["2"], "7"],
  ["idivmod", arithmetic.idivmod, ["2"], "7"],
  ["log", arithmetic.log, [{ base: "2" }], "8"],
  ["log10", arithmetic.log10, [], "100"],
  ["log2", arithmetic.log2, [], "8"],
  ["mod", arithmetic.mod, ["2"], "7"],
  ["multiply", arithmetic.multiply, ["3"], "6"],
  ["naturalLog", arithmetic.naturalLog, [], "1"],
  ["neg", arithmetic.neg, [], "5"],
  ["pow", arithmetic.pow, [2], "1.5"],
  ["precision", arithmetic.precision, [true], "1.2300"],
  ["root", arithmetic.root, [2], "9"],
  ["round", arithmetic.round, [{ places: 2 }], "1.23456"],
  ["scale", arithmetic.scale, [{ places: 4 }], "1.23456"],
  ["shiftedBy", arithmetic.shiftedBy, [2], "1.5"],
  ["sign", arithmetic.sign, [], "-5"],
  ["significantDigits", arithmetic.significantDigits, [true], "1.2300"],
  ["sqrt", arithmetic.sqrt, [], "9"],
  ["square", arithmetic.square, [], "3"],
  ["subtract", arithmetic.subtract, ["2"], "6"],
  ["toNearest", arithmetic.toNearest, ["0.5"], "1.4"],
  ["trunc", arithmetic.trunc, [], "6.9"],
  ["bitAnd", bitwise.bitAnd, ["3"], "5"],
  ["bitNot", bitwise.bitNot, [], "5"],
  ["bitOr", bitwise.bitOr, ["2"], "5"],
  ["bitXor", bitwise.bitXor, ["3"], "5"],
  ["leftShift", bitwise.leftShift, [2], "5"],
  ["rightArithShift", bitwise.rightArithShift, [1], "-5"],
  ["combinations", combinatorics.combinations, [2], 5],
  ["factorial", combinatorics.factorial, [], 5],
  ["permutations", combinatorics.permutations, [2], 5],
  ["fraction", fractions.fraction, [], "0.75"],
  ["getDenominator", fractions.getDenominator, [], "0.75"],
  ["getNumerator", fractions.getNumerator, [], "0.75"],
  ["isNegative", logical.isNegative, [], "5"],
  ["isPositive", logical.isPositive, [], "5"],
  ["isZero", logical.isZero, [], "0"],
  ["logicalAnd", logical.logicalAnd, ["1"], "5"],
  ["logicalNot", logical.logicalNot, [], "5"],
  ["logicalOr", logical.logicalOr, ["0"], "5"],
  ["logicalXor", logical.logicalXor, ["1"], "5"],
  ["cross", matrix.cross, [["1", "0", "0"]], ["0", "1", "0"]],
  ["dot", matrix.dot, [["4", "5", "6"]], ["1", "2", "3"]],
  ["fromNumber", numeric.fromNumber, [], 42],
  ["toNumber", numeric.toNumber, [{ places: 1 }], "1.25"],
  ["compare", relational.compare, ["3"], "5"],
  ["equals", relational.equals, ["3"], "5"],
  ["greaterThan", relational.greaterThan, ["3"], "5"],
  ["greaterThanOrEqual", relational.greaterThanOrEqual, ["3"], "5"],
  ["lessThan", relational.lessThan, ["3"], "5"],
  ["lessThanOrEqual", relational.lessThanOrEqual, ["3"], "5"],
  ["notEquals", relational.notEquals, ["3"], "5"],
  ["max", statistics.max, ["1", "9"], "5"],
  ["min", statistics.min, ["1", "9"], "5"],
  ["sum", statistics.sum, ["1", "2"], "3"],
  ["fromString", strings.fromString, [], "12.5"],
  ["stringify", strings.stringify, [false], "1.5"],
  ["toBase", strings.toBase, [16], "255"],
  ["toExponential", strings.toExponential, [{ places: 2 }], "1234.5678"],
  ["toFixed", strings.toFixed, [{ places: 2 }], "1.5"],
  ["toPrecision", strings.toPrecision, [{ sd: 3 }], "1.23456"],
  ...Object.entries(trigonometry)
    .filter(([name]) => name !== "atan2")
    .map(([name, fn]): Entry => [
      name,
      fn as Fn,
      [],
      name === "acoth" ? "2" : name === "atanh" ? "0.5" : "1",
    ]),
  ["atan2", trigonometry.atan2, ["1"], "1"],
];

function runPipe([fn, extras]: [Fn, any[]], input: any) {
  return extras.length ? pipe(partial(fn, ...extras))(input) : pipe(fn)(input);
}

function runCompose([fn, extras]: [Fn, any[]], input: any) {
  return extras.length
    ? compose((value: any) => fn(value, ...extras))(input)
    : compose(fn)(input);
}

describe("standalone surface through pipe and compose", () => {
  test.each(registry)("%s matches its direct call via pipe", (_n, fn, extras, input) => {
    const direct = fn(input, ...extras);
    expect(runPipe([fn, extras], input)).toEqual(direct);
  });

  test.each(registry)("%s matches its direct call via compose", (_n, fn, extras, input) => {
    const direct = fn(input, ...extras);
    expect(runCompose([fn, extras], input)).toEqual(direct);
  });

  test("registry covers every standalone export except excluded ones", () => {
    const categories = [
      arithmetic,
      bitwise,
      combinatorics,
      fractions,
      logical,
      matrix,
      numeric,
      relational,
      statistics,
      strings,
      trigonometry,
    ];
    const expected = new Set<string>();
    for (const category of categories) {
      for (const name of Object.keys(category)) expected.add(name);
    }
    expected.delete("random");

    const covered = new Set(registry.map(([name]) => name));
    const missing = [...expected].filter((name) => !covered.has(name));
    const unknown = [...covered].filter((name) => !expected.has(name));
    expect(missing).toEqual([]);
    expect(unknown).toEqual([]);
  });

  test("constants remain zero-arg factories usable as terminals", () => {
    const cases: Array<[Fn, string]> = [
      [constants.pi, "3.14159265"],
      [constants.e, "2.71828183"],
      [constants.phi, "1.61803399"],
      [constants.sqrt2, "1.41421356"],
    ];
    for (const [factory, expected] of cases) {
      const value = strings.stringify(factory());
      expect(value).toBe(expected);
    }
  });
});

describe("pipe module surface", () => {
  test("exports exactly partial, compose and pipe", () => {
    expect(Object.keys(pipeModule).sort()).toEqual([
      "compose",
      "partial",
      "pipe",
    ]);
  });
});
