import { describe, expect, test } from "vitest";
import * as pipeModule from "../src/FP/pipe";
import FixedPrecision from "../src/FixedPrecision";
import { add } from "../src/FP/arithmetic/add";
import { multiply } from "../src/FP/arithmetic/multiply";
import { sqrt } from "../src/FP/arithmetic/sqrt";
import { createFactory } from "../src/FP/construction/createFactory";
import { dataOf } from "../src/FP/construction/dataOf";
import { stringify } from "../src/FP/string/stringify";
import { bind, compose, pipe } from "../src/FP/pipe";

describe("pipe + bind", () => {
  const A = pipe(
    bind(add, "2"),
    bind(multiply, "3"),
    bind(stringify),
  )("1");

  const B = pipe(
    (x: string) => add("2", x),
    (data: Parameters<typeof multiply>[0]) => multiply("3", data),
    stringify,
  )("1");

  const C = pipe(
    bind(add, "2"),
    (data: Parameters<typeof multiply>[0]) => multiply("3", data),
    stringify,
  )("1");

  test("bind, lambdas and mixed styles produce the same result", () => {
    expect(A).toBe("9");
    expect(B).toBe("9");
    expect(C).toBe("9");
  });

  test("unary standalones plug in directly", () => {
    expect(pipe(sqrt, stringify)("9")).toBe("3");
  });

  test("bind without extra arguments is a pass-through stage", () => {
    expect(pipe(bind(sqrt), stringify)("9")).toBe("3");
  });

  test("bind doubles as a reusable transform", () => {
    const tax = bind(multiply, "1.1");
    expect(stringify(tax("100"))).toBe("110");
    expect(stringify(tax("19.99"))).toBe(stringify(multiply("19.99", "1.1")));
  });

  test("factory/dataOf contexts flow through stages", () => {
    const FP2 = FixedPrecision.create({ places: 2 });
    const Money = createFactory({ places: 2 });
    const out = pipe(bind(add, "1"))(dataOf(FP2("1.5")));
    expect(out.places).toBe(2);
    expect(stringify(out)).toBe("2.5");
    expect(stringify(pipe(bind(multiply, "3"), stringify)(Money("10")))).toBe(
      "30",
    );
  });
});

describe("compose", () => {
  test("applies stages right-to-left", () => {
    const calc = compose(stringify, bind(add, "2"), sqrt);
    expect(calc("4")).toBe("4");
    expect(compose(stringify, sqrt)("9")).toBe("3");
  });

  test("mixes bind and lambdas like pipe", () => {
    const calc = compose(
      stringify,
      (data: Parameters<typeof add>[0]) => add("2", data),
      bind(multiply, "3"),
    );
    expect(calc("1")).toBe("5");
  });
});

describe("pipe module surface", () => {
  test("exports exactly bind, compose and pipe", () => {
    expect(Object.keys(pipeModule).sort()).toEqual([
      "bind",
      "compose",
      "pipe",
    ]);
  });
});
