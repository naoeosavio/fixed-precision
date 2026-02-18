export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};

/**
 *  FixedPrecision Configuration System
 */
export interface FixedPrecisionConfig {
  /**
   * Number of decimal places to use (0-20)
   * @default 8
   */
  places: number;

  /**
   * Default rounding mode for decimal operations:
   * 0: ROUND_UP
   * 1: ROUND_DOWN
   * 2: ROUND_CEIL
   * 3: ROUND_FLOOR
   * 4: ROUND_HALF_UP
   * 5: ROUND_HALF_DOWN
   * 6: ROUND_HALF_EVEN
   * 7: ROUND_HALF_CEIL
   * 8: ROUND_HALF_FLOOR
   * @default 4
   */
  roundingMode?: RoundingMode;
}

export default class FixedPrecision {
  private value: bigint = 0n;
  private readonly ctx!: FPContext;

  private static makeContext(
    places: number,
    roundingMode: RoundingMode,
  ): FPContext {
    return {
      places,
      roundingMode,
      SCALE: BigInt(10 ** places),
      SCALENUMBER: 10 ** places,
    };
  }

  /**
   * Default context for instances created without a specific context.
   * By default, uses 8 decimal places and ROUND_HALF_UP rounding (4).
   */
  private static defaultContext: FPContext = FixedPrecision.makeContext(8, 4);

  /**
   * Configures the FixedPrecision library's default context.
   * @param config - FixedPrecision configuration
   */
  public static configure(config: FixedPrecisionConfig): void {
    let { places, roundingMode } = FixedPrecision.defaultContext;

    if (config.places !== undefined) {
      if (
        !Number.isInteger(config.places) ||
        config.places < 0 ||
        config.places > 20
      ) {
        throw new Error("Decimal places must be an integer between 0 and 20");
      }
      places = config.places;
    }

    if (config.roundingMode !== undefined) {
      if (![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(config.roundingMode)) {
        throw new Error(
          "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
        );
      }
      roundingMode = config.roundingMode;
    }

    FixedPrecision.defaultContext = FixedPrecision.makeContext(
      places,
      roundingMode,
    );
  }

  constructor(val: FixedPrecisionValue, ctx?: FPContext) {
    // establish context
    this.ctx = ctx ?? FixedPrecision.defaultContext;
    switch (typeof val) {
      case "bigint":
        this.value = val;
        break;
      case "number": {
        this.value = FixedPrecision.fromNumber(val);
        break;
      }
      case "string":
        this.value = FixedPrecision.fromString(val);
        break;
      default:
        this.value = val.value;
    }
  }

   /**
   * Creates an immutable precision factory. Each factory returns instances
   * bound to its own places and rounding mode, avoiding global mutable state.
   *
   * Example:
   *   const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
   *   const FP2 = FixedPrecision.create({ places: 2 });
   *   const a = FP8("1.23456789");
   *   const b = FP2("1.23");
   */
  public static create(
    config: FixedPrecisionConfig,
  ): (val: FixedPrecisionValue) => FixedPrecision {
    if (config.places === undefined) {
      throw new Error("Decimal places must be specified in factory config");
    }
    if (
      !Number.isInteger(config.places) ||
      config.places < 0 ||
      config.places > 20
    ) {
      throw new Error("Decimal places must be an integer between 0 and 20");
    }
    const rm = config.roundingMode ?? 4;
    if (![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(rm)) {
      throw new Error(
        "Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8",
      );
    }

    const ctx = FixedPrecision.makeContext(config.places, rm);

    const factory: (val: FixedPrecisionValue) => FixedPrecision = (
      val: FixedPrecisionValue,
    ) => {
      const instance = new FixedPrecision(val, ctx);
      return instance;
    };

    return factory;
  }

  /**
   * Helper method to create a FixedPrecision instance from a raw, already scaled bigint.
   * @param rawValue - The raw bigint value.
   * @returns A new FixedPrecision instance with the internal value set to rawValue.
   */
  protected fromRaw(rawValue: bigint): FixedPrecision {
    // const instance = new FixedPrecision(0n,this.ctx);
    // instance.value = rawValue;
    const instance = Object.create(FixedPrecision.prototype);
    instance.value = rawValue;
    instance.ctx = this.ctx;
    return instance;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Conversion helpers
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Converts a string (with up to 8 decimal places) to bigint.
  private static fromString(str: string): bigint {
    const dotIndex = str.indexOf(".", 1);
    const P = FixedPrecision.format.places;
    const SCALE_BIG = FixedPrecision.SCALE;
    const SCALE_NUM = FixedPrecision.SCALENUMBER;
    const lens = str.length;
    if (dotIndex === -1) {
      if (P < 16) {
        if (lens + P < 16) {
          const num = Number(str);
          return BigInt(num * SCALE_NUM);
        }
        if (lens < 16) {
          const num = Number(str);
          if (Number.isFinite(num)) {
            if (Math.abs(num) <= Number.MAX_SAFE_INTEGER / SCALE_NUM) {
              return BigInt(num * SCALE_NUM);
            }
            const nP = 16 - lens;
            if (nP >= P) {
              return BigInt(num * SCALE_NUM);
            }
            return BigInt(num * 10 ** nP) * BigInt(10 ** (P - nP));
          }
        }
        const num = BigInt(str);
        return num * SCALE_BIG;
      }

      if (lens < 16) {
        const num = Number(str);
        return BigInt(num) * SCALE_BIG;
      }
      const num = BigInt(str);
      return num * SCALE_BIG;
    }
    if (dotIndex + P < 16) {
      const num = Number(str);
      const nP = 16 - dotIndex;
      const nScaled = num < 0 ? -1 / SCALE_NUM : 1 / SCALE_NUM;
      if (nP >= P) {
        return BigInt(Math.trunc(num * SCALE_NUM + nScaled));
      }
      const Num = num * 10 ** nP;
      const newNum = Math.trunc(Num);
      const NewFrac = Math.trunc(newNum - Num);
      if (!NewFrac) {
        return BigInt(newNum) * BigInt(10 ** (P - nP));
      }
      return BigInt(newNum) * BigInt(10 ** (P - nP)) + BigInt(NewFrac);
    }
    const intStr = str.slice(0, dotIndex);
    const facStr = str.slice(dotIndex + 1, dotIndex + 1 + P);
    const faclen = facStr.length;
    const newLen = P >= faclen ? P - faclen : P;
    if (dotIndex < 16) {
      const int = Number(intStr);
      if (Math.abs(int) <= Number.MAX_SAFE_INTEGER / SCALE_NUM) {
        const nNum = int * SCALE_NUM;
        if (P < 16) {
          const frac = Number(facStr);
          const nScaled = BigInt(frac * 10 ** newLen);
          return nNum < 0 ? BigInt(nNum) - nScaled : BigInt(nNum) + nScaled;
        }
        const frac = BigInt(facStr);
        const nScaled = frac * BigInt(10 ** newLen);
        return nNum < 0 ? BigInt(nNum) - nScaled : BigInt(nNum) + nScaled;
      }
      if (P < 16) {
        const frac = Number(facStr);
        const nP = 16 - dotIndex;
        if (nP >= P) {
          return BigInt(int * SCALE_NUM + frac);
        }
        const Num = int * 10 ** nP;
        const nScaled = BigInt(frac * 10 ** newLen);
        return int < 0
          ? BigInt(Num) * BigInt(10 ** (P - nP)) - nScaled
          : BigInt(Num) * BigInt(10 ** (P - nP)) + nScaled;
      }
      const frac = BigInt(facStr);
      if (!frac) {
        return BigInt(int * SCALE_NUM);
      }
      const nScaled = frac * BigInt(10 ** newLen);
      return int < 0
        ? BigInt(int * SCALE_NUM) - nScaled
        : BigInt(int * SCALE_NUM) + nScaled;
    }
    const int = BigInt(intStr);
    if (P < 16) {
      const frac = Number(facStr);
      if (!frac) {
        return int * SCALE_BIG;
      }
      const nScaled = BigInt(frac * 10 ** newLen);
      return int < 0n ? int * SCALE_BIG - nScaled : int * SCALE_BIG + nScaled;
    }
    const frac = BigInt(facStr);
    if (!frac) {
      return int * SCALE_BIG;
    }
    const nScaled = frac * BigInt(10 ** newLen);
    return int < 0n ? int * SCALE_BIG - nScaled : int * SCALE_BIG + nScaled;
  }

  // Converts a number to bigint.
  private static fromNumber(value: number): bigint {
    // Verify that the input is a finite number
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error("Invalid number: value must be a finite number.");
    }
    const scaled = value * FixedPrecision.SCALENUMBER;
    if (Math.abs(scaled) > Number.MAX_SAFE_INTEGER) {
      if (Number.isInteger(value)) {
        return BigInt(value) * FixedPrecision.SCALE;
      } else {
        const num = Math.trunc(value);
        const nNum = Math.abs(num - value);
        const nScaled = BigInt(Math.trunc(nNum * FixedPrecision.SCALENUMBER));
        return BigInt(num) * FixedPrecision.SCALE + nScaled;
      }
    }
    return BigInt(Math.trunc(scaled));
  }

  // Converts an internal scaled BigInt to a number.
  private static toNumber(value: bigint): number {
    return Number(value) / FixedPrecision.SCALENUMBER;
  }

  // Converts a raw bigint to string (in normal decimal notation).
  private static toString(value: bigint): string {
    const abs = value < 0n ? 1 : 0;
    const s = value.toString();
    const P = FixedPrecision.format.places;
    const intPart = s.slice(abs, -P) || "0";
    let fracPart = s.slice(-P);
    if (
      fracPart.length !== 0 ||
      fracPart.length < P
    ) {
      fracPart = fracPart.padStart(P, "0");
    }
    return abs
      ? fracPart
        ? `-${intPart}.${fracPart}`
        : `-${intPart}`
      : fracPart
        ? `${intPart}.${fracPart}`
        : intPart;
  }

  // Instance conversion methods
  public toNumber(): number {
    return FixedPrecision.toNumber(this.value);
  }

  public toString(): string {
    return FixedPrecision.toString(this.value);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Arithmetic methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  /** Returns a FixedPrecision whose value is the absolute value of this FixedPrecision. */
  public abs(): FixedPrecision {
    return FixedPrecision.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  /** Compares the values.
   *  Returns -1 if this < other, 0 if equal, and 1 if this > other.
   */
  public cmp(other: FixedPrecision): Comparison {
    this.assertSameConfig(other);
    if (this.value < other.value) return -1;
    if (this.value > other.value) return 1;
    return 0;
  }

  /** Returns true if this FixedDecimal equals other. */
  public eq(other: FixedPrecision): boolean {
    this.assertSameConfig(other);
    return this.value === other.value;
  }

  /** Returns true if this FixedDecimal is greater than other. */
  public gt(other: FixedPrecision): boolean {
    this.assertSameConfig(other);
    return this.value > other.value;
  }

  /** Returns true if this FixedDecimal is greater than or equal to other. */
  public gte(other: FixedPrecision): boolean {
    this.assertSameConfig(other);
    return this.value >= other.value;
  }

  /** Returns true if this FixedDecimal is less than other. */
  public lt(other: FixedPrecision): boolean {
    this.assertSameConfig(other);
    return this.value < other.value;
  }

  /** Returns true if this FixedDecimal is less than or equal to other. */
  public lte(other: FixedPrecision): boolean {
    this.assertSameConfig(other);
    return this.value <= other.value;
  }

  public isZero(): boolean {
    return this.value === 0n;
  }

  public isPositive(): boolean {
    return this.value > 0n;
  }

  public isNegative(): boolean {
    return this.value < 0n;
  }

  public add(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(this.value + other.value);
  }

  /** Alias for add. */
  public plus(other: FixedPrecision): FixedPrecision {
    return this.add(other);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal minus n. */
  public sub(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(this.value - other.value);
  }

  /** Alias for sub. */
  public minus(other: FixedPrecision): FixedPrecision {
    return this.sub(other);
  }

  /** Returns a FixedPrecision whose value is this FixedPrecision times n. */
  public mul(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(
      (this.value * other.value) / FixedPrecision.SCALE,
    );
  }

  public product(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(this.value * other.value);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal divided by n. */
  public div(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(
      (this.value * FixedPrecision.SCALE) / other.value,
    );
  }

  public fraction(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(this.value / other.value);
  }

  /** Returns a FixedDecimal representing the integer remainder of dividing this by n. */
  public mod(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(
      (this.value * FixedPrecision.SCALE) % other.value,
    );
  }
  public leftover(other: FixedPrecision): FixedPrecision {
    this.assertSameConfig(other);
    return FixedPrecision.fromRaw(this.value % other.value);
  }

  /** Returns a FixedDecimal whose value is the negation of this FixedDecimal. */
  public neg(): FixedPrecision {
    return FixedPrecision.fromRaw(-this.value);
  }
  /**
   * Returns a FixedPrecision whose value is this FixedPrecision raised to the power exp.
   * (Only integer exponents are supported.)
   */
  public pow(exp: number): FixedPrecision {
    if (!Number.isInteger(exp)) throw new Error("Exponent must be an integer");
    if (exp === 0) return FixedPrecision.fromRaw(FixedPrecision.SCALE); // 1.0

    if (this.isZero()) {
      if (exp < 0) throw new Error("0 ** negative is undefined");
      return FixedPrecision.fromRaw(0n);
    }

    let e = Math.abs(exp);
    let base = this.value; // raw (scaled)
    let acc = FixedPrecision.SCALE; // raw(1.0)

    // exponentiation by squaring in scaled space
    while (e > 0) {
      if (e & 1) acc = (acc * base) / FixedPrecision.SCALE;
      base = (base * base) / FixedPrecision.SCALE;
      e >>= 1;
    }

    if (exp < 0) {
      // raw(1/x) = (SCALE * SCALE) / raw(x)
      const inv = (FixedPrecision.SCALE * FixedPrecision.SCALE) / acc;
      return FixedPrecision.fromRaw(inv);
    }
    return FixedPrecision.fromRaw(acc);
  }

  /**
   * Returns a FixedPrecision representing π (pi) with the current precision
   */
  public static PI(): FixedPrecision {
    return new FixedPrecision(Math.PI);
  }

  /**
   * Returns a FixedPrecision representing e (Euler's number) with current precision
   */
  public static e(): FixedPrecision {
    return new FixedPrecision(Math.E);
  }

  /**
   * Returns a FixedPrecision representing φ (golden ratio) with current precision
   */
  public static phi(): FixedPrecision {
    const phiValue = (1 + Math.sqrt(5)) / 2;
    return new FixedPrecision(phiValue);
  }

  /**
   * Returns a FixedPrecision representing √2 with current precision
   */
  public static sqrt2(): FixedPrecision {
    const sqrt2Value = Math.sqrt(2);
    return new FixedPrecision(sqrt2Value);
  }

  /**
   * Returns a FixedPrecision whose value is the square root of this FixedPrecision.
   * (For simplicity, we use Math.sqrt on the number value.)
   */
  public sqrt(): FixedPrecision {
    if (this.isNegative()) {
      throw new Error("Square root of negative number");
    }
    if (this.isZero()) {
      return new FixedPrecision(0n);
    }
    // Initial guess: x / 2.0
    const initialGuess = this.fraction(new FixedPrecision(2n));
    return this.sqrtGo(initialGuess, FixedPrecision.format.places);
  }

  /**
   * Newton–Raphson iteration for square root.
   * @param guess Current approximation.
   * @param iter  Remaining iterations.
   * @returns Improved square root approximation.
   */
  private sqrtGo(guess: FixedPrecision, iter: number): FixedPrecision {
    if (iter <= 0) {
      return guess;
    }
    // next = (guess + (x / guess)) / 2.0
    const next = guess
      .add(this.div(guess))
      .fraction(FixedPrecision.fromRaw(2n));
    if (guess.eq(next)) {
      return next;
    }
    return this.sqrtGo(next, iter - 1);
  }

  /**
   * Returns a JSON representation of this FixedPrecision (its string value).
   */
  public toJSON(): string {
    return this.toString();
  }

  /**
   * Returns a new FixedPrecision representing the ceiling of this value.
   * For positive numbers, rounds up; for negatives, rounds toward zero.
   */
  public ceil(): FixedPrecision {
    // Using ROUND_CEIL (2)
    return this.round(0, 2);
  }

  /**
   * Returns a new FixedPrecision representing the floor of this value.
   * For positive numbers, rounds down; for negatives, rounds away from zero.
   */
  public floor(): FixedPrecision {
    // Using ROUND_FLOOR (3)
    return this.round(0, 3);
  }

  /**
   * Returns a new FixedPrecision representing the value truncated toward zero.
   */
  public trunc(): FixedPrecision {
    // Using ROUND_DOWN (1)
    return this.round(0, 1);
  }

  /**
   * Returns a new FixedPrecision with its value shifted by n decimal places.
   * A positive n shifts to the left (multiplication), negative to the right (division).
   *
   * The operation is exact; if a negative shift does not divide evenly, an error is thrown.
   *
   * @param n - The number of places to shift.
   * @returns A new FixedPrecision instance with the shifted value.
   */
  public shiftedBy(n: number): FixedPrecision {
    const shiftFactor = 10n ** BigInt(Math.abs(n));
    let newRaw: bigint;
    if (n >= 0) {
      newRaw = this.value * shiftFactor;
    } else {
      if (this.value % shiftFactor !== 0n) {
        throw new Error("Inexact shift");
      }
      newRaw = this.value / shiftFactor;
    }
    return FixedPrecision.fromRaw(newRaw);
  }

  /**
   * Returns a new FixedPrecision with a pseudo-random value ≥ 0 and < 1.
   * The result will have the specified number of decimal places.
   *
   * @param decimalPlaces - Number of decimal places (default: FixedPrecision.format.places).
   * @returns A new FixedPrecision representing a random value.
   */
  public static random(
    decimalPlaces: number = FixedPrecision.format.places,
  ): FixedPrecision {
    const max = 10 ** decimalPlaces;
    const randInt = Math.floor(Math.random() * max);
    const fracStr = randInt.toString().padStart(decimalPlaces, "0");
    const valueStr = `0.${fracStr}`;
    return new FixedPrecision(valueStr);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Formatting methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  /**
   * Rounds the internal value according to the given scaling factor and rounding mode.
   *
   * @param roundingFactor - The rounding factor (power of 10).
   * @param rm - Rounding mode to use
   * @returns The quotient after rounding (without the discarded digits)
   */
  private roundToScale(roundingFactor: bigint, rm: RoundingMode): bigint {
    const quotient = this.value / roundingFactor;
    const remainder = this.value % roundingFactor;
    // Use absolute remainder for comparisons.
    const absRem = remainder < 0n ? -remainder : remainder;
    switch (rm) {
      case 0: // ROUND_UP: round away from zero
        return remainder === 0n
          ? quotient
          : this.value > 0n
            ? quotient + 1n
            : quotient - 1n;
      case 1: // ROUND_DOWN: round towards zero (truncate)
        return quotient;
      case 2: // ROUND_CEIL: round towards +Infinity
        return this.value > 0n && remainder !== 0n ? quotient + 1n : quotient;
      case 3: // ROUND_FLOOR: round towards -Infinity
        return this.value < 0n && remainder !== 0n ? quotient - 1n : quotient;
      case 4: // ROUND_HALF_UP: if exactly half, round away from zero
        return 2n * absRem >= roundingFactor
          ? this.value > 0n
            ? quotient + 1n
            : quotient - 1n
          : quotient;
      case 5: // ROUND_HALF_DOWN: if exactly half, round towards zero
        return 2n * absRem > roundingFactor
          ? this.value > 0n
            ? quotient + 1n
            : quotient - 1n
          : quotient;
      case 6: // ROUND_HALF_EVEN: if exactly half, round to even
        if (2n * absRem === roundingFactor) {
          return quotient % 2n === 0n
            ? quotient
            : this.value > 0n
              ? quotient + 1n
              : quotient - 1n;
        }
        return 2n * absRem > roundingFactor
          ? this.value > 0n
            ? quotient + 1n
            : quotient - 1n
          : quotient;
      case 7: // ROUND_HALF_CEIL: if exactly half, round towards +Infinity
        if (2n * absRem === roundingFactor) {
          return this.value > 0n ? quotient + 1n : quotient;
        }
        return 2n * absRem > roundingFactor
          ? this.value > 0n
            ? quotient + 1n
            : quotient
          : quotient;
      case 8: // ROUND_HALF_FLOOR: if exactly half, round towards -Infinity
        if (2n * absRem === roundingFactor) {
          return this.value < 0n ? quotient - 1n : quotient;
        }
        return 2n * absRem > roundingFactor
          ? this.value > 0n
            ? quotient + 1n
            : quotient - 1n
          : quotient;
      default:
        throw new Error(`Rounding mode ${rm} is not supported.`);
    }
  }

  /**
   * Returns a new FixedPrecision with the value rounded to the specified number of decimal places.
   *
   * @param dp - Desired number of decimal places (default: FixedPrecision.format.places)
   * @param rm - Rounding mode (default: FixedPrecision.format.roundingMode)
   * @returns A new FixedPrecision instance with the rounded value.
   */
  public round(
    dp: number = FixedPrecision.format.places,
    rm: RoundingMode = FixedPrecision.format.roundingMode,
  ): FixedPrecision {
    if (dp < 0 || dp > FixedPrecision.format.places) {
      throw new Error(
        `Decimal places (dp) must be between 0 and ${FixedPrecision.format.places}`,
      );
    }
    const diff = FixedPrecision.format.places - dp;
    const factor = 10n ** BigInt(diff);
    const rounded = this.roundToScale(factor, rm);
    const newValue = rounded * factor;
    return FixedPrecision.fromRaw(newValue);
  }

  /**
   * Adjusts the number scale, rounding to the new number of decimal places.
   * Returns a new FixedPrecision with the adjusted value.
   *
   * Example:
   *    new FixedPrecision("1.23456789").scale(2)  // represents 1.23
   */
  public scale(
    newScale: number,
    rm: RoundingMode = FixedPrecision.format.roundingMode,
  ): FixedPrecision {
    if (newScale < 0 || newScale > FixedPrecision.format.places) {
      throw new Error(
        `newScale must be between 0 and ${FixedPrecision.format.places}`,
      );
    }
    const diff = FixedPrecision.format.places - newScale;
    const factor = 10n ** BigInt(diff);
    const rounded = this.roundToScale(factor, rm);
    const newValue = rounded * factor;
    return FixedPrecision.fromRaw(newValue);
  }

  toExponential(
    dp: number = FixedPrecision.format.places,
    rm?: RoundingMode,
  ): string {
    const rounded = this.round(dp, rm);
    const [int = "", frac = ""] = rounded.toString().split(".");
    const exp =
      int.length > 1
        ? int.length - 1
        : int === "0"
          ? -frac?.search(/[1-9]/) - 1
          : 0;
    const shifted = rounded.div(
      new FixedPrecision(10n ** BigInt(Math.abs(exp))),
    );
    return `${shifted.toFixed(dp)}e${exp}`;
  }

  toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) {
      throw new Error("Invalid precision");
    }
    return this.round(sd - (Math.floor(Math.log10(this.toNumber())) + 1), rm)
      .toString()
      .replace(/0+$/, "");
  }

  /**
   * Returns a string representing the FixedPrecision in normal notation
   * to a fixed number of decimal places.
   */
  public toFixed(
    places: number = 0,
    rm: RoundingMode = FixedPrecision.format.roundingMode,
  ): string {
    const decPlaces =
      places !== undefined ? places : FixedPrecision.format.places;
    if (decPlaces < 0 || decPlaces > FixedPrecision.format.places) {
      throw new Error(
        `places must be between 0 and ${FixedPrecision.format.places}`,
      );
    }
    const diff = FixedPrecision.format.places - decPlaces;
    const roundingFactor = 10n ** BigInt(diff);
    const scaled = this.roundToScale(roundingFactor, rm);
    const divisor = 10n ** BigInt(decPlaces);
    const intPart = scaled / divisor;
    const fracPart = (scaled % divisor).toString().padStart(decPlaces, "0");
    return decPlaces > 0
      ? `${intPart.toString()}.${fracPart}`
      : intPart.toString();
  }

  public valueOf(): string {
    return this.toString();
  }

  /**
   * Returns the type of this object as a string ('FixedPrecision')
   */
  public typeof(): "FixedPrecision" {
    return "FixedPrecision";
  }

  public raw(): bigint {
    return this.value;
  }
  public get places(): number {
    return FixedPrecision.format.places;
  }
  public get roundingMode(): RoundingMode {
    return FixedPrecision.format.roundingMode;
  }
  public get SCALE(): bigint {
    return FixedPrecision.SCALE;
  }
  public get SCALENUMBER(): number {
    return FixedPrecision.SCALENUMBER;
  }

}

/**
 * Setup helper
 * Usage example:
 *
 *   import FixedPrecision, { fixedconfig } from './FixedPrecision';
 *   fixedconfig.configure({ places: 8, roundingMode: 4 });
 */
export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
