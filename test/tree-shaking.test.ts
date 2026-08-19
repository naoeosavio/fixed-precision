import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { add } from "../src/add";
import FixedPrecision from "../src/FixedPrecision";

describe("tree-shaking / functional-first", () => {
  test("add standalone constrói instância real com métodos core", () => {
    const result = add("1.5", "2.25");
    expect(result instanceof FixedPrecision).toBe(true);
    expect(result.toString()).toBe("3.75");
    expect(result.raw()).toBe(375000000n);
    expect(result.places()).toBe(8);
  });

  test("método cuja função não está no bundle lança erro claro", () => {
    const result = add("1", "2");
    expect(() => result.mul("2")).toThrow(/not available/);
    expect(() => new FixedPrecision("1").sin()).toThrow(/not available/);
  });

  test("importar o módulo da função habilita o método correspondente", async () => {
    await import("../src/multiply");
    const result = add("2", "3");
    expect(result.mul("2").toString()).toBe("10");
  });

  test("bundle do subpath não embute a lib completa (após build)", () => {
    if (!existsSync("dist/add.js")) return;
    const bundle = readFileSync("dist/add.js", "utf8");
    expect(bundle.length).toBeLessThan(20000);
    expect(bundle.includes("3.14159265358979323846")).toBe(false);
    const compare = readFileSync("dist/compare.js", "utf8");
    expect(compare.length).toBeLessThan(10000);
    expect(compare.includes("3.14159265358979323846")).toBe(false);
  });
});
