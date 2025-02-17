export type RoundingMode = 0 | 1 | 2 | 3;
export type Comparison = -1 | 0 | 1;

export namespace FixedDecimal {
  export type Value = string | number | bigint | FixedDecimal;
}

export default class FixedDecimal {
  private value: bigint;

  /**
   * Formatting settings.
   * By default, `places` (decimal places) is 8.
   */
  public static format = {
    places: 8,
  };
  // Pre-calculate the scale factor
  private static readonly SCALE: bigint =
    10n ** BigInt(FixedDecimal.format.places);
  private static readonly SCALENUMBER: number =
    10 ** FixedDecimal.format.places;

  constructor(val: FixedDecimal.Value) {
    if (val instanceof FixedDecimal) {
      this.value = val.value;
    } else if (typeof val === "bigint") {
      // When a bigint is passed in, we assume it is an unscaled integer
      // so we multiply by 10^places.
      this.value = val * FixedDecimal.SCALE;
    } else if (typeof val === "string") {
      this.value = FixedDecimal.fromString(val);
    } else if (typeof val === "number") {
      this.value = FixedDecimal.fromNumber(val);
    } else {
      throw new Error("Invalid type for FixedDecimal");
    }
  }

  /**
   * Create an instance from a raw (already scaled) bigint.
   * This helper is used by arithmetic methods so that we don’t apply
   * the 10^places scaling again.
   */
  private static fromRaw(rawValue: bigint): FixedDecimal {
    const instance = new FixedDecimal(0n);
    instance.value = rawValue;
    return instance;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Conversion helpers
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Converts a string (with up to 8 decimal places) to bigint.
  static fromString(value: string): bigint {
    const dotIndex = value.split(".");
    if (dotIndex.length > 2) {
      throw new Error("Invalid decimal format");
    }
    const integerPart = dotIndex[0] || "0";
    if (dotIndex.length < 2) {
      // No decimal part: multiply by 10^places.
      if (integerPart.length + FixedDecimal.format.places < 16) {
        return BigInt(Number(integerPart) * FixedDecimal.SCALENUMBER);
      }
      return BigInt(integerPart) * FixedDecimal.SCALE;
    }
    let decimalPart = dotIndex[1];
    let len = decimalPart.length;
    if (len > FixedDecimal.format.places) {
      decimalPart = decimalPart.slice(0, FixedDecimal.format.places);
      len = FixedDecimal.format.places;
    }
    if (integerPart.length + FixedDecimal.format.places < 16) {
      const decimal =
        len === FixedDecimal.format.places
          ? Number(decimalPart)
          : Number(decimalPart) * 10 ** (FixedDecimal.format.places - len);
      return BigInt(Number(integerPart) * FixedDecimal.SCALENUMBER + decimal);
    }
    const decimal =
      len === FixedDecimal.format.places
        ? BigInt(decimalPart)
        : BigInt(decimalPart) *
        BigInt(10 ** (FixedDecimal.format.places - len));
    return BigInt(integerPart) * FixedDecimal.SCALE + decimal;
  }

  // Converts a number to bigint.
  static fromNumber(value: number): bigint {
    // Verify that the input is a finite number
    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
      throw new Error("Invalid number: value must be a finite number.");
    }

    const scaled = value * FixedDecimal.SCALENUMBER;

    // Check if the scaled value is within JavaScript's safe integer range
    if (scaled > Number.MAX_SAFE_INTEGER || scaled < Number.MIN_SAFE_INTEGER) {
      throw new Error(
        `Number out of safe range after scaling. Scaled value: ${scaled}`
      );
    }

    // Convert the scaled number to a string (with no decimals) and then to BigInt
    return BigInt(scaled.toFixed(0));
  }

  // Converts an internal scaled BigInt to a number.
  static toNumber(value: bigint): number {
    return Number(value) / FixedDecimal.SCALENUMBER;
  }

  // Converts a raw bigint to string (in normal decimal notation).
  static toString(value: bigint): string {
    let abs = value < 0n ? 0 : 1;
    const s = value.toString();
    const intPart = abs
      ? s.slice(0, -FixedDecimal.format.places) || "0"
      : s.slice(1, -FixedDecimal.format.places) || "0";
    let fracPart = s.slice(-FixedDecimal.format.places); //.replace(/0+$/, "");
    if (fracPart.length < FixedDecimal.format.places) {
      fracPart.padStart(FixedDecimal.format.places, "0");
    }
    return abs
      ? fracPart
        ? `${intPart}.${fracPart}`
        : intPart
      : fracPart
        ? `-${intPart}.${fracPart}`
        : `-${intPart}`;
  }

  // Instance conversion methods
  public toNumber(): number {
    return FixedDecimal.toNumber(this.value);
  }

  public toString(): string {
    return FixedDecimal.toString(this.value);
  }

  public valueOf(): string {
    return this.toString();
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Arithmetic methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  /** Returns a FixedDecimal whose value is the absolute value of this FixedDecimal. */
  public abs(): FixedDecimal {
    return FixedDecimal.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal plus n. */
  public add(other: FixedDecimal): FixedDecimal {
    console.log(this.value + other.value);

    return FixedDecimal.fromRaw(this.value + other.value);
  }

  /** Alias for add. */
  public plus(other: FixedDecimal): FixedDecimal {
    return this.add(other);
  }

  /** Compares the values.
   *  Returns -1 if this < other, 0 if equal, and 1 if this > other.
   */
  public cmp(other: FixedDecimal): Comparison {
    if (this.value < other.value) return -1;
    if (this.value > other.value) return 1;
    return 0;
  }

  /** Returns true if this FixedDecimal equals other. */
  public eq(other: FixedDecimal): boolean {
    return this.value === other.value;
  }

  /** Returns true if this FixedDecimal is greater than other. */
  public gt(other: FixedDecimal): boolean {
    return this.value > other.value;
  }

  /** Returns true if this FixedDecimal is greater than or equal to other. */
  public gte(other: FixedDecimal): boolean {
    return this.value >= other.value;
  }

  /** Returns true if this FixedDecimal is less than other. */
  public lt(other: FixedDecimal): boolean {
    return this.value < other.value;
  }

  /** Returns true if this FixedDecimal is less than or equal to other. */
  public lte(other: FixedDecimal): boolean {
    return this.value <= other.value;
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal minus n. */
  public sub(other: FixedDecimal): FixedDecimal {
    return FixedDecimal.fromRaw(this.value - other.value);
  }

  /** Alias for sub. */
  public minus(other: FixedDecimal): FixedDecimal {
    return this.sub(other);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal times n. */
  public mul(other: FixedDecimal): FixedDecimal {
    return FixedDecimal.fromRaw(
      (this.value * other.value) / FixedDecimal.SCALE
    );
  }

  /** Alias for mul. */
  public product(other: FixedDecimal): FixedDecimal {
    return new FixedDecimal(this.value * other.value);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal divided by n. */
  public div(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }
    return FixedDecimal.fromRaw(
      (this.value * FixedDecimal.SCALE) / other.value
    );
  }

  public fraction(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }
    return FixedDecimal.fromRaw(this.value / other.value);
  }

  /** Returns a FixedDecimal representing the integer remainder of dividing this by n. */
  public mod(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero in modulus");
    }
    return FixedDecimal.fromRaw(
      (this.value * FixedDecimal.SCALE) % other.value
    );
  }
  public leftover(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero in modulus");
    }
    return FixedDecimal.fromRaw(this.value % other.value);
  }

  /** Returns a FixedDecimal whose value is the negation of this FixedDecimal. */
  public neg(): FixedDecimal {
    return FixedDecimal.fromRaw(-this.value);
  }

  /**
   * Returns a FixedDecimal whose value is this FixedDecimal raised to the power exp.
   * (Only integer exponents are supported.)
   */
  public pow(exp: number): FixedDecimal {
    if (!Number.isInteger(exp)) {
      throw new Error("Exponent must be an integer");
    }
    let result = FixedDecimal.fromRaw(this.value ** BigInt(exp))
    return exp < 0 ? new FixedDecimal(1n).div(result) : result;
  }


  /**
   * Returns a new FixedDecimal whose value is this FixedDecimal rounded
   * to a maximum of dp decimal places.
   * (The rounding mode rm is not explicitly implemented here.)
   */
  public round(
    dp: number = FixedDecimal.format.places,
    rm: RoundingMode = 1
  ): FixedDecimal {
    const roundedStr = this.toFixed(dp);
    return new FixedDecimal(roundedStr);
  }

  /**
   * Returns a FixedDecimal whose value is the square root of this FixedDecimal.
   * (For simplicity, we use Math.sqrt on the number value.)
   */
  public sqrt(): FixedDecimal {
    if (this.lt(new FixedDecimal(0n))) {
      throw new Error("Square root of negative number");
    }
    if (this.eq(new FixedDecimal(0n))) {
      return new FixedDecimal(0n);
    }
    // Initial guess: x / 2.0
    const initialGuess = this.div(new FixedDecimal(2n));
    return this.sqrtGo(initialGuess, 10);
  }

  /**
   * Newton–Raphson iteration for square root.
   * @param guess Current approximation.
   * @param iter  Remaining iterations.
   * @returns Improved square root approximation.
   */
  private sqrtGo(guess: FixedDecimal, iter: number): FixedDecimal {
    if (iter === 0) {
      return guess;
    }
    // next = (guess + (x / guess)) / 2.0
    const next = guess.add(this.div(guess)).div(new FixedDecimal(2n));
    if (guess.eq(next)) {
      return next;
    }
    return this.sqrtGo(next, iter - 1);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Formatting methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  /**
   * Returns a string representing the FixedDecimal in exponential notation,
   * rounded to dp decimal places.
   */
  public toExponential(dp?: number, rm: RoundingMode = 1): string {
    const num = this.toNumber();
    return dp !== undefined ? num.toExponential(dp) : num.toExponential();
  }

  /**
   * Returns a string representing the FixedDecimal to sd significant digits.
   */
  public toPrecision(sd?: number, rm: RoundingMode = 1): string {
    const num = this.toNumber();
    return sd !== undefined ? num.toPrecision(sd) : num.toPrecision();
  }

  /**
   * Helper to perform symmetric rounding.
   * Receives a rounding factor equivalent to 10^(8 - desired decimal places).
   */
  private roundToScale(roundingFactor: bigint): bigint {
    if (this.value >= 0n) {
      return (this.value + roundingFactor / 2n) / roundingFactor;
    } else {
      return (this.value - roundingFactor / 2n) / roundingFactor;
    }
  }

  /**
   * Adjusts the number scale, rounding to the new number of decimal places.
   * Returns a new FixedDecimal with the adjusted value.
   *
   * Example:
   *    new FixedDecimal("1.23456789").scale(2)  // represents 1.23
   */
  public scale(newScale: number): FixedDecimal {
    if (newScale < 0 || newScale > FixedDecimal.format.places) {
      throw new Error(
        `newScale must be between 0 and ${FixedDecimal.format.places}`
      );
    }
    const diff = FixedDecimal.format.places - newScale;
    const factor = 10n ** BigInt(diff);
    const rounded = this.roundToScale(factor);
    const newValue = rounded * factor;
    return FixedDecimal.fromRaw(newValue);
  }

  /**
   * Returns a string representing the FixedDecimal in normal notation
   * to a fixed number of decimal places.
   */
  public toFixed(places?: number): string {
    const decPlaces =
      places !== undefined ? places : FixedDecimal.format.places;
    if (decPlaces < 0 || decPlaces > FixedDecimal.format.places) {
      throw new Error(
        `places must be between 0 and ${FixedDecimal.format.places}`
      );
    }
    const diff = FixedDecimal.format.places - decPlaces;
    const roundingFactor = 10n ** BigInt(diff);
    const scaled = this.roundToScale(roundingFactor);
    const divisor = 10n ** BigInt(decPlaces);
    const intPart = scaled / divisor;
    const fracPart = (scaled % divisor).toString().padStart(decPlaces, "0");
    return decPlaces > 0
      ? `${intPart.toString()}.${fracPart}`
      : intPart.toString();
  }
}
