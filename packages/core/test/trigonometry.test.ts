import { describe, expect, test } from "vitest";
import FixedPrecision, { fixedconfig } from "../src/FixedPrecision";

const FP20 = FixedPrecision.create({ places: 20, roundingMode: 4 });

const SIN_INPUTS: Record<number, string> = {
  0: "0",
  15: "0.26179938779914943653",
  30: "0.52359877559829887307",
  45: "0.78539816339744830961",
  60: "1.04719755119659774615",
  75: "1.30899693899574718269",
  90: "1.57079632679489661923",
  105: "1.83259571459404605576",
  120: "2.09439510239319549230",
  135: "2.35619449019234492884",
  150: "2.61799387799149436538",
  165: "2.87979326579064380192",
  180: "3.14159265358979323846",
  195: "3.40339204138894267499",
  210: "3.66519142918809211153",
  225: "3.92699081698724154807",
  240: "4.18879020478639098461",
  255: "4.45058959258554042115",
  270: "4.71238898038468985769",
  285: "4.97418836818383929422",
  300: "5.23598775598298873076",
  315: "5.49778714378213816730",
  330: "5.75958653158128760384",
  345: "6.02138591938043704038",
  360: "6.28318530717958647692",
};

// Referências: trigonometria de 45 dígitos (Python Decimal) dos inputs acima,
// truncadas para 20 casas. `null` = singularidade (a função lança).
const REF: Record<
  number,
  {
    sin: string;
    cos: string;
    tan: string | null;
    cot: string | null;
    sec: string | null;
    csc: string | null;
  }
> = {
  0: {
    sin: "0.00000000000000000000",
    cos: "1.00000000000000000000",
    tan: "0.00000000000000000000",
    cot: null,
    sec: "1.00000000000000000000",
    csc: null,
  },
  15: {
    sin: "0.25881904510252076234",
    cos: "0.96592582628906828675",
    tan: "0.26794919243112270646",
    cot: "3.73205080756887729365",
    sec: "1.03527618041008304939",
    csc: "3.86370330515627314712",
  },
  30: {
    sin: "0.49999999999999999999",
    cos: "0.86602540378443864676",
    tan: "0.57735026918962576449",
    cot: "1.73205080756887729355",
    sec: "1.15470053837925152901",
    csc: "2.00000000000000000002",
  },
  45: {
    sin: "0.70710678118654752439",
    cos: "0.70710678118654752440",
    tan: "0.99999999999999999998",
    cot: "1.00000000000000000001",
    sec: "1.41421356237309504879",
    csc: "1.41421356237309504880",
  },
  60: {
    sin: "0.86602540378443864676",
    cos: "0.50000000000000000000",
    tan: "1.73205080756887729351",
    cot: "0.57735026918962576451",
    sec: "1.99999999999999999998",
    csc: "1.15470053837925152902",
  },
  75: {
    sin: "0.96592582628906828674",
    cos: "0.25881904510252076235",
    tan: "3.73205080756887729348",
    cot: "0.26794919243112270647",
    sec: "3.86370330515627314695",
    csc: "1.03527618041008304939",
  },
  90: {
    sin: "0.99999999999999999999",
    cos: "0.00000000000000000000",
    tan: null,
    cot: "0.00000000000000000000",
    sec: null,
    csc: "1.00000000000000000000",
  },
  105: {
    sin: "0.96592582628906828675",
    cos: "-0.25881904510252076233",
    tan: "-3.73205080756887729367",
    cot: "-0.26794919243112270646",
    sec: "-3.86370330515627314714",
    csc: "1.03527618041008304939",
  },
  120: {
    sin: "0.86602540378443864676",
    cos: "-0.49999999999999999999",
    tan: "-1.73205080756887729356",
    cot: "-0.57735026918962576449",
    sec: "-2.00000000000000000002",
    csc: "1.15470053837925152901",
  },
  135: {
    sin: "0.70710678118654752440",
    cos: "-0.70710678118654752439",
    tan: "-1.00000000000000000001",
    cot: "-0.99999999999999999998",
    sec: "-1.41421356237309504881",
    csc: "1.41421356237309504879",
  },
  150: {
    sin: "0.50000000000000000000",
    cos: "-0.86602540378443864676",
    tan: "-0.57735026918962576451",
    cot: "-1.73205080756887729350",
    sec: "-1.15470053837925152902",
    csc: "1.99999999999999999998",
  },
  165: {
    sin: "0.25881904510252076235",
    cos: "-0.96592582628906828674",
    tan: "-0.26794919243112270647",
    cot: "-3.73205080756887729346",
    sec: "-1.03527618041008304939",
    csc: "3.86370330515627314694",
  },
  180: {
    sin: "0.00000000000000000000",
    cos: "-0.99999999999999999999",
    tan: "-0.00000000000000000000",
    cot: null,
    sec: "-1.00000000000000000000",
    csc: null,
  },
  195: {
    sin: "-0.25881904510252076233",
    cos: "-0.96592582628906828675",
    tan: "0.26794919243112270646",
    cot: "3.73205080756887729369",
    sec: "-1.03527618041008304939",
    csc: "-3.86370330515627314716",
  },
  210: {
    sin: "-0.49999999999999999999",
    cos: "-0.86602540378443864676",
    tan: "0.57735026918962576449",
    cot: "1.73205080756887729356",
    sec: "-1.15470053837925152901",
    csc: "-2.00000000000000000003",
  },
  225: {
    sin: "-0.70710678118654752439",
    cos: "-0.70710678118654752440",
    tan: "0.99999999999999999998",
    cot: "1.00000000000000000001",
    sec: "-1.41421356237309504878",
    csc: "-1.41421356237309504881",
  },
  240: {
    sin: "-0.86602540378443864676",
    cos: "-0.50000000000000000000",
    tan: "1.73205080756887729350",
    cot: "0.57735026918962576451",
    sec: "-1.99999999999999999997",
    csc: "-1.15470053837925152902",
  },
  255: {
    sin: "-0.96592582628906828674",
    cos: "-0.25881904510252076235",
    tan: "3.73205080756887729344",
    cot: "0.26794919243112270647",
    sec: "-3.86370330515627314692",
    csc: "-1.03527618041008304939",
  },
  270: {
    sin: "-0.99999999999999999999",
    cos: "0.00000000000000000000",
    tan: null,
    cot: "0.00000000000000000000",
    sec: null,
    csc: "-1.00000000000000000000",
  },
  285: {
    sin: "-0.96592582628906828675",
    cos: "0.25881904510252076233",
    tan: "-3.73205080756887729371",
    cot: "-0.26794919243112270645",
    sec: "3.86370330515627314717",
    csc: "-1.03527618041008304939",
  },
  300: {
    sin: "-0.86602540378443864676",
    cos: "0.49999999999999999999",
    tan: "-1.73205080756887729357",
    cot: "-0.57735026918962576449",
    sec: "2.00000000000000000003",
    csc: "-1.15470053837925152901",
  },
  315: {
    sin: "-0.70710678118654752440",
    cos: "0.70710678118654752439",
    tan: "-1.00000000000000000001",
    cot: "-0.99999999999999999998",
    sec: "1.41421356237309504881",
    csc: "-1.41421356237309504878",
  },
  330: {
    sin: "-0.50000000000000000000",
    cos: "0.86602540378443864675",
    tan: "-0.57735026918962576452",
    cot: "-1.73205080756887729349",
    sec: "1.15470053837925152902",
    csc: "-1.99999999999999999997",
  },
  345: {
    sin: "-0.25881904510252076235",
    cos: "0.96592582628906828674",
    tan: "-0.26794919243112270647",
    cot: "-3.73205080756887729342",
    sec: "1.03527618041008304939",
    csc: "-3.86370330515627314690",
  },
  360: {
    sin: "0.00000000000000000000",
    cos: "0.99999999999999999999",
    tan: "0.00000000000000000000",
    cot: null,
    sec: "1.00000000000000000000",
    csc: null,
  },
};

function units(decimal: string): bigint {
  const negative = decimal.startsWith("-");
  const [integer, fraction = ""] = decimal.replace("-", "").split(".");
  const scaled = BigInt(integer + fraction.padEnd(20, "0").slice(0, 20));
  return negative ? -scaled : scaled;
}

function expect_close(actual: FixedPrecision, reference: string, ulps: number) {
  const diff = units(actual.toString()) - units(reference);
  expect(diff <= BigInt(ulps) && -diff <= BigInt(ulps)).toBe(true);
}

describe("Trigonometry", () => {
  for (const [degrees, refs] of Object.entries(REF)) {
    const angle = FP20(SIN_INPUTS[Number(degrees)]);

    test(`sin ${degrees}°`, () => expect_close(angle.sin(), refs.sin, 3));
    test(`cos ${degrees}°`, () => expect_close(angle.cos(), refs.cos, 3));
    test(`tan ${degrees}°`, () => {
      if (refs.tan === null) {
        expect(() => angle.tan()).toThrow();
      } else {
        expect_close(angle.tan(), refs.tan, 15);
      }
    });
    test(`cot ${degrees}°`, () => {
      if (refs.cot === null) {
        expect(() => angle.cot()).toThrow();
      } else {
        expect_close(angle.cot(), refs.cot, 15);
      }
    });
    test(`sec ${degrees}°`, () => {
      if (refs.sec === null) {
        expect(() => angle.sec()).toThrow();
      } else {
        expect_close(angle.sec(), refs.sec, 15);
      }
    });
    test(`csc ${degrees}°`, () => {
      if (refs.csc === null) {
        expect(() => angle.csc()).toThrow();
      } else {
        expect_close(angle.csc(), refs.csc, 15);
      }
    });
  }

  test("fast paths are exact", () => {
    expect(FP20(SIN_INPUTS[45]).tan().toString()).toBe("1");
    expect(FP20(SIN_INPUTS[45]).cot().toString()).toBe("1");
    expect(FP20(SIN_INPUTS[60]).sec().toString()).toBe("2");
    expect(FP20(SIN_INPUTS[30]).csc().toString()).toBe("2");
    expect(FP20(SIN_INPUTS[90]).sin().toString()).toBe("1");
    expect(FP20(SIN_INPUTS[90]).cos().toString()).toBe("0");
    expect(FP20(SIN_INPUTS[90]).cot().toString()).toBe("0");
    expect(FP20(SIN_INPUTS[0]).tan().toString()).toBe("0");
  });

  test("complementary: sin(x) = cos(90°-x)", () => {
    for (const degrees of [15, 30, 45, 60, 75]) {
      const sin = FP20(SIN_INPUTS[degrees]).sin();
      const cos = FP20(SIN_INPUTS[90 - degrees]).cos();
      const diff = units(sin.toString()) - units(cos.toString());
      expect(diff <= 2n && -diff <= 2n).toBe(true);
    }
  });

  test("asin acos roundtrip", () => {
    expect_close(
      FP20("0.7071067811865475244").asin().sin(),
      "0.7071067811865475244",
      3,
    );
    expect_close(
      FP20("0.7071067811865475244").acos().cos(),
      "0.7071067811865475244",
      3,
    );
  });

  test("inverse domain validation", () => {
    expect(() => FP20("1.5").asin()).toThrow();
    expect(() => FP20("1.5").acos()).toThrow();
    expect(() => FP20("-1.5").asin()).toThrow();
    expect(() => FP20("0.5").asec()).toThrow();
    expect(() => FP20("0.5").acsc()).toThrow();
  });

  test("domain validation", () => {
    expect(() => FP20("0").csc()).toThrow();
    expect(() => FP20("0").cot()).toThrow();
    expect(() => FP20("2").asin()).toThrow();
    expect(() => FP20("2").acos()).toThrow();
    expect(() => FP20("0.5").asec()).toThrow();
    expect(() => FP20("0.5").acsc()).toThrow();
    expect(() => FP20("0.5").acosh()).toThrow();
    expect(() => FP20("1").atanh()).toThrow();
    expect(() => FP20("2").asech()).toThrow();
    expect(() => FP20("0").acsch()).toThrow();
    expect(() => FP20("1").acoth()).toThrow();
    expect(() => FP20("0").csch()).toThrow();
    expect(() => FP20("0").coth()).toThrow();
  });

  test("sinh 0.5", () => {
    expect(FP20("0.5").sinh().toString()).toBe(
      FP20("0.52109530549374736162").toString(),
    );
  });
  test("cosh 0.5", () => {
    expect(FP20("0.5").cosh().toString()).toBe(
      FP20("1.12762596520638078522").toString(),
    );
  });
  test("tanh 0.5", () => {
    expect(FP20("0.5").tanh().toString()).toBe(
      FP20("0.46211715726000975850").toString(),
    );
  });
  test("sech 0.5", () => {
    expect(FP20("0.5").sech().toString()).toBe(
      FP20("0.88681888397007390866").toString(),
    );
  });
  test("csch 0.5", () => {
    expect(FP20("0.5").csch().toString()).toBe(
      FP20("1.91903475133494371950").toString(),
    );
  });
  test("coth 0.5", () => {
    expect(FP20("0.5").coth().toString()).toBe(
      FP20("2.16395341373865284878").toString(),
    );
  });

  test("asinh 1.5", () => {
    expect(FP20("1.5").asinh().toString()).toBe(
      FP20("1.19476321728710930410").toString(),
    );
  });
  test("acosh 1.5", () => {
    expect(FP20("1.5").acosh().toString()).toBe(
      FP20("0.96242365011920689499").toString(),
    );
  });
  test("atanh 0.5", () => {
    expect(FP20("0.5").atanh().toString()).toBe(
      FP20("0.54930614433405484569").toString(),
    );
  });
  test("asech 0.5", () => {
    expect(FP20("0.5").asech().toString()).toBe(
      FP20("1.31695789692481670862").toString(),
    );
  });
  test("acsch 2", () => {
    expect(FP20("2").acsch().toString()).toBe(
      FP20("0.48121182505960344749").toString(),
    );
  });
  test("acoth 2", () => {
    expect(FP20("2").acoth().toString()).toBe(
      FP20("0.54930614433405484569").toString(),
    );
  });

  test("static wrappers", () => {
    fixedconfig.configure({ places: 20, roundingMode: 4 });
    try {
      const FP16 = FixedPrecision.create({ places: 16, roundingMode: 4 });
      const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
      expect(FixedPrecision.sin(FP16("0.5")).toString()).toBe(
        FP16("0.5").sin().toString(),
      );
      expect(FixedPrecision.cos(FP8("0.5")).toString()).toBe(
        FP8("0.5").cos().toString(),
      );
      expect(FixedPrecision.tan(FP16("0.5")).toString()).toBe(
        FP16("0.5").tan().toString(),
      );
      expect(FixedPrecision.atan2(FP8("1"), FP8("-1")).toString()).toBe(
        FP8("1").atan2(FP8("-1")).toString(),
      );
      expect(FixedPrecision.acosh(FP16("1.5")).toString()).toBe(
        FP16("1.5").acosh().toString(),
      );
    } finally {
      fixedconfig.configure({ places: 8, roundingMode: 4 });
    }
  });
});
