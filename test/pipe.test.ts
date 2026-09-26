import { describe, expect, test } from "vitest";
import FixedPrecision from "../src/FixedPrecision";
import * as arithmetic from "../src/FP/arithmetic";
import { add } from "../src/FP/arithmetic/add";
import { multiply } from "../src/FP/arithmetic/multiply";
import { sqrt } from "../src/FP/arithmetic/sqrt";
import * as bitwise from "../src/FP/bitwise";
import * as combinatorics from "../src/FP/combinatorics";
import * as constants from "../src/FP/constants";
import type { FixedPrecisionData } from "../src/FP/construction";
import { createFactory } from "../src/FP/construction/createFactory";
import { dataOf } from "../src/FP/construction/dataOf";
import * as fractions from "../src/FP/fractions";
import * as logical from "../src/FP/logical";
import * as matrix from "../src/FP/matrix";
import * as numeric from "../src/FP/numeric";
import * as pipeModule from "../src/FP/pipe";
import { compose, partial, pipe } from "../src/FP/pipe";
import * as relational from "../src/FP/relational";
import * as statistics from "../src/FP/statistics";
import * as strings from "../src/FP/string";
import { stringify } from "../src/FP/string/stringify";
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
    expect(out.ctx.places).toBe(2);
    expect(stringify(out)).toBe("2.5");
    expect(
      stringify(pipe(partial(multiply, "3"), stringify)(Money("10"))),
    ).toBe("30");
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
    type Repeat<
      Stage,
      Count extends number,
      Acc extends Stage[] = [],
    > = Acc["length"] extends Count
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

describe("typings", () => {
  test("mismatched stages fail to compile", () => {
    const mismatched_pipe = pipe(
      (value: string) => value,
      (value: number) => value,
    );
    // @ts-expect-error incompatible stages resolve to never
    mismatched_pipe("x");

    const mismatched_compose = compose(
      (value: number) => value,
      (value: string) => value,
    );
    // @ts-expect-error incompatible stages resolve to never
    mismatched_compose("x");
  });

  test("partial requires its trailing arguments", () => {
    // @ts-expect-error add requires its second argument to be bound
    partial(add);
    // @ts-expect-error places is a number
    partial(arithmetic.round, { places: "2" });
  });

  test("empty pipelines are the identity", () => {
    expect(pipe()("value")).toBe("value");
    expect(compose()(42)).toBe(42);
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
  ["shift", arithmetic.shift, [2], "1.5"],
  ["sign", arithmetic.sign, [], "-5"],
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
  ["rightShift", bitwise.rightShift, [1], "-5"],
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
  ["cross", matrix.cross, [["4", "5", "6"]], ["1", "2", "3"]],
  ["dot", matrix.dot, [["4", "5", "6"]], ["1", "2", "3"]],
  ["crossBy", matrix.crossBy(["0", "1", "0"]), [], ["1", "0", "0"]],
  ["dotBy", matrix.dotBy(["4", "5", "6"]), [], ["1", "2", "3"]],
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
    .filter(([name]) => name !== "atan2" && name !== "atan2By")
    .map(
      ([name, fn]): Entry => [
        name,
        fn as Fn,
        [],
        name === "acoth" ? "2" : name === "atanh" ? "0.5" : "1",
      ],
    ),
  ["atan2", trigonometry.atan2, ["1"], "1"],
  // Curried By variants, registered in pre-applied unary form.
  ["addBy", arithmetic.addBy("2"), [], "6"],
  ["subtractBy", arithmetic.subtractBy("2"), [], "6"],
  ["multiplyBy", arithmetic.multiplyBy("3"), [], "6"],
  ["divideBy", arithmetic.divideBy("2"), [], "6"],
  ["modBy", arithmetic.modBy("2"), [], "7"],
  ["idivBy", arithmetic.idivBy("2"), [], "7"],
  ["divmodBy", arithmetic.divmodBy("2"), [], "7"],
  ["idivmodBy", arithmetic.idivmodBy("2"), [], "7"],
  ["powBy", arithmetic.powBy(2), [], "1.5"],
  ["rootBy", arithmetic.rootBy(2), [], "9"],
  ["shiftBy", arithmetic.shiftBy(2), [], "1.5"],
  ["logBy", arithmetic.logBy({ base: "2" }), [], "8"],
  ["toNearestBy", arithmetic.toNearestBy("0.5"), [], "1.4"],
  ["scaleBy", arithmetic.scaleBy({ places: 4 }), [], "1.23456"],
  ["roundBy", arithmetic.roundBy({ places: 2 }), [], "1.23456"],
  ["clampBy", arithmetic.clampBy("1", "5"), [], "3"],
  ["precisionBy", arithmetic.precisionBy(true), [], "1.2300"],
  ["bitAndBy", bitwise.bitAndBy("3"), [], "5"],
  ["bitOrBy", bitwise.bitOrBy("2"), [], "5"],
  ["bitXorBy", bitwise.bitXorBy("3"), [], "5"],
  ["leftShiftBy", bitwise.leftShiftBy(2), [], "5"],
  ["rightShiftBy", bitwise.rightShiftBy(1), [], "-5"],
  ["permutationsBy", combinatorics.permutationsBy(2), [], 5],
  ["combinationsBy", combinatorics.combinationsBy(2), [], 5],
  ["fractionBy", fractions.fractionBy(), [], "0.75"],
  ["logicalAndBy", logical.logicalAndBy("1"), [], "5"],
  ["logicalOrBy", logical.logicalOrBy("0"), [], "5"],
  ["logicalXorBy", logical.logicalXorBy("1"), [], "5"],
  ["toNumberBy", numeric.toNumberBy({ places: 1 }), [], "1.25"],
  ["compareBy", relational.compareBy("3"), [], "5"],
  ["equalsBy", relational.equalsBy("3"), [], "5"],
  ["greaterThanBy", relational.greaterThanBy("3"), [], "5"],
  ["greaterThanOrEqualBy", relational.greaterThanOrEqualBy("3"), [], "5"],
  ["lessThanBy", relational.lessThanBy("3"), [], "5"],
  ["lessThanOrEqualBy", relational.lessThanOrEqualBy("3"), [], "5"],
  ["notEqualsBy", relational.notEqualsBy("3"), [], "5"],
  ["stringifyBy", strings.stringifyBy(false), [], "1.5"],
  ["toBaseBy", strings.toBaseBy(16), [], "255"],
  ["toExponentialBy", strings.toExponentialBy({ places: 2 }), [], "1234.5678"],
  ["toFixedBy", strings.toFixedBy({ places: 2 }), [], "1.5"],
  ["toPrecisionBy", strings.toPrecisionBy({ sd: 3 }), [], "1.23456"],
  ["atan2By", trigonometry.atan2By("1"), [], "1"],
  // Short class-style aliases and their By variants.
  ["plus", arithmetic.plus, ["2"], "6"],
  ["minus", arithmetic.minus, ["2"], "6"],
  ["times", arithmetic.times, ["3"], "6"],
  ["ratio", arithmetic.ratio, ["2"], "6"],
  ["rem", arithmetic.rem, ["2"], "7"],
  ["eql", relational.eql, ["3"], "5"],
  ["cmp", relational.cmp, ["3"], "5"],
  ["gtn", relational.gtn, ["3"], "5"],
  ["gte", relational.gte, ["3"], "5"],
  ["ltn", relational.ltn, ["3"], "5"],
  ["lte", relational.lte, ["3"], "5"],
  ["neq", relational.neq, ["3"], "5"],
  ["plusBy", arithmetic.plusBy("2"), [], "6"],
  ["minusBy", arithmetic.minusBy("2"), [], "6"],
  ["timesBy", arithmetic.timesBy("3"), [], "6"],
  ["ratioBy", arithmetic.ratioBy("2"), [], "6"],
  ["remBy", arithmetic.remBy("2"), [], "7"],
  ["eqlBy", relational.eqlBy("3"), [], "5"],
  ["cmpBy", relational.cmpBy("3"), [], "5"],
  ["gtnBy", relational.gtnBy("3"), [], "5"],
  ["gteBy", relational.gteBy("3"), [], "5"],
  ["ltnBy", relational.ltnBy("3"), [], "5"],
  ["lteBy", relational.lteBy("3"), [], "5"],
  ["neqBy", relational.neqBy("3"), [], "5"],
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
  test.each(registry)(
    "%s matches its direct call via pipe",
    (_n, fn, extras, input) => {
      const direct = fn(input, ...extras);
      expect(runPipe([fn, extras], input)).toEqual(direct);
    },
  );

  test.each(registry)(
    "%s matches its direct call via compose",
    (_n, fn, extras, input) => {
      const direct = fn(input, ...extras);
      expect(runCompose([fn, extras], input)).toEqual(direct);
    },
  );

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
