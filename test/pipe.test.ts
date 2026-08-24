import { describe, expect, test } from "vitest";
import {
  add,
  clamp,
  divide,
  divmod,
  multiply,
  round,
  sqrt,
} from "../src/FP/arithmetic/index";
import { permutations } from "../src/FP/combinatorics/permutations";
import { dot } from "../src/FP/matrix/dot";
import { greaterThan } from "../src/FP/relational/greaterThan";
import { sum } from "../src/FP/statistics/sum";
import { atan2 } from "../src/FP/trigonometry/atan2";
import { toFixed } from "../src/FP/string/toFixed";
import { stringify } from "../src/FP/string/stringify";
import { createFactory } from "../src/FP/construction/createFactory";
import type { FixedPrecisionData } from "../src/FP/construction";
import { compose, pipe } from "../src/FP/pipe";

describe("pipe / compose com funções standalone", () => {
  test("unárias passam direto como estágio", () => {
    expect(pipe(sqrt, stringify)("9")).toBe("3");
    expect(compose(stringify, sqrt)("9")).toBe("3");
  });

  test("lambdas sobre standalones funcionam como estágio", () => {
    const total = pipe(
      (x: string) => add("2", x),
      (data: FixedPrecisionData) => multiply("3", data),
      stringify,
    )("1");
    expect(total).toBe("9");
  });

  test("pipe.bind liga a cauda e o dado entra primeiro", () => {
    expect(pipe.bind(add, "2")("1")).toEqual(add("1", "2"));
    expect(stringify(pipe.bind(add, "2")("1"))).toBe("3");
  });

  test("compose.bind é o mesmo binder", () => {
    expect(pipe.bind).toBe(compose.bind);
    const tax = compose.bind(multiply, "1.1");
    expect(stringify(tax("100"))).toBe("110");
  });

  test("compose aplica da direita para a esquerda", () => {
    const calc = compose(stringify, pipe.bind(add, "2"), sqrt);
    expect(calc("4")).toBe("4");
  });

  test("options object via bind", () => {
    expect(
      pipe(pipe.bind(round, { places: 2 }), stringify)("1.23456"),
    ).toBe("1.23");
    expect(pipe.bind(toFixed, { places: 2 })("1.5")).toBe("1.50");
  });

  test("ternária (clamp) com dois argumentos ligados", () => {
    const bounded = pipe.bind(clamp, "1", "3");
    expect(stringify(bounded("5"))).toBe("3");
    expect(stringify(bounded("-1"))).toBe("1");
  });

  test("variádicas ligam operandos extras separadamente", () => {
    expect(stringify(pipe.bind(sum, "1", "2")("3"))).toBe("6");
    expect(stringify(pipe.bind(sum, "4")("1"))).toBe("5");
  });

  test("shapes especiais mantêm o valor na primeira posição", () => {
    expect(stringify(pipe.bind(permutations, 2)(5))).toBe("20");
    expect(stringify(pipe.bind(dot, ["4", "5", "6"])(["1", "2", "3"]))).toBe(
      "32",
    );
    expect(stringify(pipe.bind(atan2, "1")("1"))).toBe("0.78539816");
  });

  test("terminais mudam o tipo dentro do pipeline", () => {
    expect(pipe(pipe.bind(toFixed, { places: 2 }))("1.5")).toBe("1.50");
    expect(pipe(pipe.bind(greaterThan, "2"))("3")).toBe(true);
    expect(pipe.bind(divmod, "2")("7").quotient.value).toBe(
      divmod("7", "2").quotient.value,
    );
  });

  test("divide continua utilizável fora de pipelines", () => {
    expect(stringify(divide("7", "2"))).toBe("3.5");
  });

  test("contexto de factory preservado através do pipe", () => {
    const Money = createFactory({ places: 2 });
    const grossUp = pipe(
      pipe.bind(multiply, "3"),
      pipe.bind(toFixed, { places: 2 }),
    );
    expect(grossUp(Money("10.00"))).toBe("30.00");
  });
});
