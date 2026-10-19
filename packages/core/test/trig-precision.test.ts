import { describe, expect, test } from "vitest";
import FixedPrecision from "../src/FixedPrecision";

const REFS = {
  "sin(0.5)": "0.479425538604203000273287935215571388081803368",
  "cos(0.5)": "0.877582561890372716116281582603829651991645197",
  "tan(0.5)": "0.546302489843790513255179465780285383297551720",
  "tan(1)": "1.557407724654902230506974807458360173087250772",
  "csc(0.5)": "2.085829642933488185772501675459290301962309587",
  "cos(100)": "0.862318872287683934728409960086205423036919977",
  "sin(1000000)": "-0.349993502171292952117652486780771469061406605",
  "sin(12345.6789)": "-0.703441921263821062701360333685409354352673557",
};

const PLACES = [7, 16, 18];

const TRUNCATED_ANGLES: Record<number, Record<string, string>> = {
  3: { a15: "0.261", a30: "0.523", a45: "0.785", a60: "1.047", a90: "1.570" },
  7: {
    a15: "0.2617993",
    a30: "0.5235987",
    a45: "0.7853981",
    a60: "1.0471975",
    a90: "1.5707963",
  },
  8: {
    a15: "0.26179938",
    a30: "0.52359877",
    a45: "0.78539816",
    a60: "1.04719755",
    a90: "1.57079632",
  },
  13: {
    a15: "0.2617993877991",
    a30: "0.5235987755982",
    a45: "0.7853981633974",
    a60: "1.0471975511965",
    a90: "1.5707963267948",
  },
  16: {
    a15: "0.2617993877991494",
    a30: "0.5235987755982988",
    a45: "0.7853981633974483",
    a60: "1.0471975511965977",
    a90: "1.5707963267948966",
  },
  18: {
    a15: "0.261799387799149436",
    a30: "0.523598775598298873",
    a45: "0.785398163397448309",
    a60: "1.047197551196597746",
    a90: "1.570796326794896619",
  },
  20: {
    a15: "0.26179938779914943653",
    a30: "0.52359877559829887307",
    a45: "0.78539816339744830961",
    a60: "1.04719755119659774615",
    a90: "1.57079632679489661923",
  },
};

function scale_units(places: number): bigint {
  return BigInt(10) ** BigInt(places);
}

function units(decimal: string, places: number): bigint {
  const negative = decimal.startsWith("-");
  const [integer, fraction = ""] = decimal.replace("-", "").split(".");
  const scaled = BigInt(
    integer + fraction.padEnd(places, "0").slice(0, places),
  );
  return negative ? -scaled : scaled;
}

function units_to_string(value: bigint, places: number): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value)
    .toString()
    .padStart(places + 1, "0");
  const integer = digits.slice(0, digits.length - places);
  return `${negative ? "-" : ""}${integer}.${digits.slice(digits.length - places)}`;
}

function expect_ulp_close(
  actual: FixedPrecision,
  reference: string,
  places: number,
  ulps: number,
) {
  const diff = units(actual.toString(), places) - units(reference, places);
  expect(diff <= BigInt(ulps) && -diff <= BigInt(ulps)).toBe(true);
}

describe("Trigonometry precision", () => {
  describe("reference table (45 digits) — <= 2 ulps", () => {
    for (const places of PLACES) {
      const FP = FixedPrecision.create({ places, roundingMode: 4 });
      test(`sin(0.5) places=${places}`, () =>
        expect_ulp_close(FP("0.5").sin(), REFS["sin(0.5)"], places, 2));
      test(`cos(0.5) places=${places}`, () =>
        expect_ulp_close(FP("0.5").cos(), REFS["cos(0.5)"], places, 2));
      test(`tan(0.5) places=${places}`, () =>
        expect_ulp_close(FP("0.5").tan(), REFS["tan(0.5)"], places, 2));
      test(`tan(1) places=${places}`, () =>
        expect_ulp_close(FP("1").tan(), REFS["tan(1)"], places, 2));
      test(`csc(0.5) places=${places}`, () =>
        expect_ulp_close(FP("0.5").csc(), REFS["csc(0.5)"], places, 2));
      test(`cos(100) places=${places}`, () =>
        expect_ulp_close(FP("100").cos(), REFS["cos(100)"], places, 2));
    }
  });

  describe("angle reduction for large inputs — <= 2 ulps", () => {
    for (const places of PLACES) {
      const FP = FixedPrecision.create({ places, roundingMode: 4 });
      test(`sin(10^6) places=${places}`, () =>
        expect_ulp_close(FP("1000000").sin(), REFS["sin(1000000)"], places, 2));
      test(`sin(12345.6789) places=${places}`, () =>
        expect_ulp_close(
          FP("12345.6789").sin(),
          REFS["sin(12345.6789)"],
          places,
          2,
        ));
    }
  });

  describe("fast paths are exact across supported places", () => {
    for (const [places, angles] of Object.entries(TRUNCATED_ANGLES)) {
      const FP = FixedPrecision.create({
        places: Number(places),
        roundingMode: 4,
      });
      test(`places=${places}`, () => {
        expect(FP(angles.a45).tan().toString()).toBe("1");
        expect(FP(angles.a45).cot().toString()).toBe("1");
        expect(FP(angles.a60).sec().toString()).toBe("2");
        expect(FP(angles.a30).csc().toString()).toBe("2");
        expect(FP(angles.a90).sin().toString()).toBe("1");
        expect(FP(angles.a90).cos().toString()).toBe("0");
        expect(FP(angles.a90).cot().toString()).toBe("0");
        expect(() => FP(angles.a90).tan()).toThrow();
        expect(() => FP(angles.a90).sec()).toThrow();
        expect(() => FP("0").cot()).toThrow();
        expect(() => FP("0").csc()).toThrow();
        expect(FP("0").sin().toString()).toBe("0");
        expect(FP("0").cos().toString()).toBe("1");
      });
    }
  });

  describe("pythagorean identity across supported places", () => {
    for (const [places, angles] of Object.entries(TRUNCATED_ANGLES)) {
      const FP = FixedPrecision.create({
        places: Number(places),
        roundingMode: 4,
      });
      for (const key of ["a15", "a30", "a45"] as const) {
        test(`sin^2+cos^2=1 places=${places} ${key}`, () => {
          const sin = FP(angles[key]).sin();
          const cos = FP(angles[key]).cos();
          const one = sin.mul(sin).add(cos.mul(cos));
          expect_ulp_close(one, "1", Number(places), 6);
        });
      }
    }
  });

  describe("tangent near the singularity (pi/2 +/- 1..10 ulps)", () => {
    const places = 16;
    const FP = FixedPrecision.create({ places, roundingMode: 4 });
    const half_units = 15707963267948966n;

    for (let k = 0; k <= 10; k += 1) {
      test(`tan(pi/2 - ${k} ulps) places=16`, () => {
        const value = FP(units_to_string(half_units - BigInt(k), places));
        if (k <= 1) {
          expect(() => value.tan()).toThrow();
        } else {
          const magnitude =
            (Number(value.tan().valueOf()) * k) / Number(scale_units(places));
          expect(magnitude).toBeGreaterThan(0.5);
          expect(magnitude).toBeLessThan(2);
        }
      });
      test(`tan(pi/2 + ${k} ulps) places=16`, () => {
        const value = FP(units_to_string(half_units + BigInt(k), places));
        if (k <= 1) {
          expect(() => value.tan()).toThrow();
        } else {
          const magnitude =
            (Number(value.tan().valueOf()) * k) / Number(scale_units(places));
          expect(magnitude).toBeLessThan(-0.5);
          expect(magnitude).toBeGreaterThan(-2);
        }
      });
      test(`cos(pi/2 - ${k} ulps) places=16`, () => {
        const value = FP(units_to_string(half_units - BigInt(k), places));
        expect_ulp_close(
          value.cos(),
          units_to_string(BigInt(k), places),
          places,
          2,
        );
      });
    }
  });

  describe("hyperbolic reference table (45 digits) — <= 3 ulps", () => {
    const HYPERBOLIC_REFS: Record<string, Record<string, string>> = {
      "0.5": {
        sinh: "0.52109530549374736162",
        cosh: "1.12762596520638078522",
        tanh: "0.4621171572600097585",
        sech: "0.88681888397007390865",
        csch: "1.91903475133494371949",
        coth: "2.16395341373865284877",
      },
      "1": {
        sinh: "1.17520119364380145688",
        cosh: "1.54308063481524377847",
        tanh: "0.76159415595576488811",
        sech: "0.64805427366388539957",
        csch: "0.85091812823932154513",
        coth: "1.31303528549933130363",
      },
      "2": {
        sinh: "3.62686040784701876766",
        cosh: "3.76219569108363145956",
        tanh: "0.96402758007581688394",
        sech: "0.26580222883407969212",
        csch: "0.27572056477178320775",
        coth: "1.03731472072754809587",
      },
      "-0.5": {
        sinh: "-0.52109530549374736162",
        cosh: "1.12762596520638078522",
        tanh: "-0.4621171572600097585",
        sech: "0.88681888397007390865",
        csch: "-1.91903475133494371949",
        coth: "-2.16395341373865284877",
      },
      "-2": {
        sinh: "-3.62686040784701876766",
        cosh: "3.76219569108363145956",
        tanh: "-0.96402758007581688394",
        sech: "0.26580222883407969212",
        csch: "-0.27572056477178320775",
        coth: "-1.03731472072754809587",
      },
    };
    const HYPERBOLIC_FNS: Record<
      string,
      (v: FixedPrecision) => FixedPrecision
    > = {
      sinh: (v: FixedPrecision) => v.sinh(),
      cosh: (v: FixedPrecision) => v.cosh(),
      tanh: (v: FixedPrecision) => v.tanh(),
      sech: (v: FixedPrecision) => v.sech(),
      csch: (v: FixedPrecision) => v.csch(),
      coth: (v: FixedPrecision) => v.coth(),
    };

    for (const places of PLACES) {
      const FP = FixedPrecision.create({ places, roundingMode: 4 });
      for (const [x, refs] of Object.entries(HYPERBOLIC_REFS)) {
        for (const fn of Object.keys(HYPERBOLIC_FNS)) {
          test(`${fn}(${x}) places=${places}`, () =>
            expect_ulp_close(HYPERBOLIC_FNS[fn](FP(x)), refs[fn], places, 3));
        }
      }
    }
  });

  describe("inverse hyperbolic reference table — <= 3 ulps", () => {
    const INVERSE_REFS: Array<[string, string, string]> = [
      ["asinh", "0.5", "0.48121182505960344749"],
      ["asinh", "1.5", "1.19476321728710930411"],
      ["asinh", "2", "1.44363547517881034249"],
      ["asinh", "-0.5", "-0.48121182505960344749"],
      ["acosh", "1.5", "0.96242365011920689499"],
      ["acosh", "2", "1.31695789692481670862"],
      ["acosh", "3", "1.76274717403908605046"],
      ["atanh", "0.5", "0.54930614433405484569"],
      ["atanh", "0.9", "1.47221948958322023"],
      ["atanh", "-0.5", "-0.54930614433405484569"],
      ["asech", "0.5", "1.31695789692481670862"],
      ["asech", "0.9", "0.46714530810326201812"],
      ["acsch", "1", "0.88137358701954302523"],
      ["acsch", "2", "0.48121182505960344749"],
      ["acsch", "-2", "-0.48121182505960344749"],
      ["acoth", "1.5", "0.8047189562170501873"],
      ["acoth", "2", "0.54930614433405484569"],
      ["acoth", "-2", "-0.54930614433405484569"],
    ];

    const INVERSE_FNS: Record<string, (v: FixedPrecision) => FixedPrecision> = {
      asinh: (v: FixedPrecision) => v.asinh(),
      acosh: (v: FixedPrecision) => v.acosh(),
      atanh: (v: FixedPrecision) => v.atanh(),
      asech: (v: FixedPrecision) => v.asech(),
      acsch: (v: FixedPrecision) => v.acsch(),
      acoth: (v: FixedPrecision) => v.acoth(),
    };

    for (const places of [16, 20]) {
      const FP = FixedPrecision.create({ places, roundingMode: 4 });
      for (const [fn, x, ref] of INVERSE_REFS) {
        test(`${fn}(${x}) places=${places}`, () =>
          expect_ulp_close(INVERSE_FNS[fn](FP(x)), ref, places, 3));
      }
    }
  });

  describe("hyperbolic series for small |x| (2.5)", () => {
    const FP = FixedPrecision.create({ places: 20, roundingMode: 4 });
    const one_ulp = "0.00000000000000000001";
    const one_nano = "0.000000001";

    function expect_relative_close(
      actual: FixedPrecision,
      reference: string,
      rel: number,
    ) {
      const ref_units = units(reference, 20);
      const diff = units(actual.toString(), 20) - ref_units;
      const bound = ref_units < 0n ? -ref_units : ref_units;
      const limit = (bound * BigInt(Math.ceil(rel * 1e15))) / 1000000000000000n;
      expect(diff <= limit && -diff <= limit).toBe(true);
    }

    test("tanh(1 ulp) = 1 ulp", () => {
      expect(FP(one_ulp).tanh().toString()).toBe(one_ulp);
    });
    test("tanh(-1 ulp) = -1 ulp", () => {
      expect(FP(`-${one_ulp}`).tanh().toString()).toBe(`-${one_ulp}`);
    });
    test("sinh(1 ulp) = 1 ulp", () => {
      expect(FP(one_ulp).sinh().toString()).toBe(one_ulp);
    });
    test("cosh and sech at 1 ulp are exactly 1", () => {
      expect(FP(one_ulp).cosh().toString()).toBe("1");
      expect(FP(`-${one_ulp}`).cosh().toString()).toBe("1");
      expect(FP(one_ulp).sech().toString()).toBe("1");
    });
    test("csch(1 ulp) = 1/ulp", () => {
      expect(FP(one_ulp).csch().toString()).toBe("100000000000000000000");
      expect(FP(`-${one_ulp}`).csch().toString()).toBe(
        "-100000000000000000000",
      );
    });
    test("coth(1 ulp) = 1/ulp", () => {
      expect(FP(one_ulp).coth().toString()).toBe("100000000000000000000");
    });
    test("sinh(1e-9) keeps sign and value", () => {
      expect(FP(one_nano).sinh().toString()).toBe(one_nano);
      expect(FP(`-${one_nano}`).sinh().toString()).toBe(`-${one_nano}`);
    });
    test("tanh(1e-9) = 1e-9", () => {
      expect(FP(one_nano).tanh().toString()).toBe(one_nano);
      expect(FP(`-${one_nano}`).tanh().toString()).toBe(`-${one_nano}`);
    });
    test("cosh(1e-9) = 1 + 5e-19", () => {
      expect_ulp_close(FP(one_nano).cosh(), "1.0000000000000000005", 20, 2);
      expect_ulp_close(
        FP(`-${one_nano}`).cosh(),
        "1.0000000000000000005",
        20,
        2,
      );
    });
    test("sech(1e-9) = 1 - 5e-19", () => {
      expect_ulp_close(FP(one_nano).sech(), "0.9999999999999999995", 20, 2);
    });
    test("csch(1e-9) matches 1/sinh within relative 1e-15", () => {
      expect_relative_close(
        FP(one_nano).csch(),
        "999999999.999999999833333333",
        1e-15,
      );
      expect_relative_close(
        FP(`-${one_nano}`).csch(),
        "-999999999.999999999833333333",
        1e-15,
      );
    });
    test("coth(1e-9) matches 1/tanh within relative 1e-15", () => {
      expect_relative_close(
        FP(one_nano).coth(),
        "1000000000.000000000333333333",
        1e-15,
      );
      expect_relative_close(
        FP(`-${one_nano}`).coth(),
        "-1000000000.000000000333333333",
        1e-15,
      );
    });
    test("all six hyperbolics at x = 1e-6 boundary", () => {
      expect_ulp_close(
        FP("0.000001").sinh(),
        "0.000001000000000000166666",
        20,
        2,
      );
      expect_ulp_close(
        FP("0.000001").cosh(),
        "1.000000000000500000000000",
        20,
        2,
      );
      expect_ulp_close(
        FP("0.000001").tanh(),
        "0.000000999999999999666666",
        20,
        2,
      );
      expect_ulp_close(
        FP("0.000001").sech(),
        "0.999999999999500000000000",
        20,
        2,
      );
      expect_relative_close(
        FP("0.000001").csch(),
        "999999.999999833333333333352777",
        1e-12,
      );
      expect_relative_close(
        FP("0.000001").coth(),
        "1000000.000000333333333333311111",
        1e-12,
      );
    });
  });

  describe("places = 0 (degenerate scale)", () => {
    const FP0 = FixedPrecision.create({ places: 0, roundingMode: 4 });
    test("tan(1 rad) throws near truncated pi/2", () => {
      expect(() => FP0("1").tan()).toThrow();
    });
    test("cot(0) and csc(0) throw", () => {
      expect(() => FP0("0").cot()).toThrow();
      expect(() => FP0("0").csc()).toThrow();
    });
    test("cot(1 rad) does not hit the dead 45 degrees check", () => {
      expect(FP0("1").cot().toString()).toBe("1");
    });
    test("sin and cos stay bounded (1 ulp tolerance at places=0)", () => {
      expect(FP0("1").sin().toString()).toBe("1");
      expect(["-1", "0", "1"]).toContain(FP0("1").cos().toString());
    });
  });
});
