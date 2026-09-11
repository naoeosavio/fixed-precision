import { describe, expect, test } from "vitest";

import FixedPrecision from "../src/FixedPrecision";
import Minimal from "../src/Minimal";
import { dataOf } from "../src/FP/construction/dataOf";
import { createFactory } from "../src/FP/construction/createFactory";
import { divmod as fpDivmod, idivmod as fpIdivmod, mod as fpMod } from "../src/FP/arithmetic";
import { stringify } from "../src/FP/string/stringify";

describe("mod/rem/rest/divmod table — 1.5 @ 0.4 (4.4)", () => {
  const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
  const M8 = Minimal.create({ places: 8, roundingMode: 4 });
  const F8 = createFactory({ places: 8, roundingMode: 4 });
  const a = FP8("1.5");
  const b = FP8("0.4");

  test("mod — scaled modulo", () => {
    expect(a.mod(b).toString()).toBe("0");
    expect(M8("1.5").mod(M8("0.4")).toString()).toBe("0");
    expect(stringify(fpMod(dataOf(F8("1.5")), dataOf(F8("0.4"))))).toBe("0");
  });

  test("rem — raw remainder (class only)", () => {
    expect(a.rem(b).toString()).toBe("0.3");
  });

  test("rest — exact divmod remainder (class only)", () => {
    expect(a.rest(b).toString()).toBe("0");
    expect(a.rest(b).eq(a.divmod(b).remainder)).toBe(true);
  });

  test("divmod — quotient + exact remainder", () => {
    expect(a.divmod(b).quotient.toString()).toBe("3.75");
    expect(a.divmod(b).remainder.toString()).toBe("0");
    expect(M8("1.5").divmod(M8("0.4")).quotient.toString()).toBe("3.75");
    expect(M8("1.5").divmod(M8("0.4")).remainder.toString()).toBe("0");
    const q = fpDivmod(dataOf(F8("1.5")), dataOf(F8("0.4")));
    expect(stringify(q.quotient)).toBe("3.75");
    expect(stringify(q.remainder)).toBe("0");
  });

  test("idivmod — integer quotient + remainder", () => {
    expect(a.idivmod(b).quotient.toString()).toBe("3");
    expect(a.idivmod(b).remainder.toString()).toBe("0.3");
    const r = fpIdivmod(dataOf(F8("1.5")), dataOf(F8("0.4")));
    expect(stringify(r.quotient)).toBe("3");
    expect(stringify(r.remainder)).toBe("0.3");
  });
});

describe("mod/rem/rest/divmod table — 12.34 @ 5.67 (4.4)", () => {
  const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
  const M8 = Minimal.create({ places: 8, roundingMode: 4 });
  const F8 = createFactory({ places: 8, roundingMode: 4 });
  const a = FP8("12.34");
  const b = FP8("5.67");

  test("matches docs/arithmetic.md reference table", () => {
    expect(a.mod(b).toString()).toBe("1.72");
    expect(a.rem(b).toString()).toBe("1");
    expect(a.rest(b).toString()).toBe("0.00000002");
    expect(a.divmod(b).quotient.toString()).toBe("2.17636684");
    expect(a.divmod(b).remainder.toString()).toBe("0.00000002");
    expect(a.idivmod(b).quotient.toString()).toBe("2");
    expect(a.idivmod(b).remainder.toString()).toBe("1");
  });

  test("Minimal agrees on mod and divmod", () => {
    expect(M8("12.34").mod(M8("5.67")).toString()).toBe("1.72");
    const dm = M8("12.34").divmod(M8("5.67"));
    expect(dm.quotient.toString()).toBe("2.17636684");
    expect(dm.remainder.toString()).toBe("0.00000002");
  });

  test("functional agrees on mod, divmod and idivmod", () => {
    const x = dataOf(F8("12.34"));
    const y = dataOf(F8("5.67"));
    expect(stringify(fpMod(x, y))).toBe("1.72");
    const dm = fpDivmod(x, y);
    expect(stringify(dm.quotient)).toBe("2.17636684");
    expect(stringify(dm.remainder)).toBe("0.00000002");
    const idm = fpIdivmod(x, y);
    expect(stringify(idm.quotient)).toBe("2");
    expect(stringify(idm.remainder)).toBe("1");
  });

  test("reconstruction identities hold", () => {
    expect(a.divmod(b).quotient.mul(b).add(a.divmod(b).remainder).toString()).toBe("12.34");
    expect(a.idivmod(b).quotient.mul(b).add(a.idivmod(b).remainder).toString()).toBe("12.34");
  });
});
