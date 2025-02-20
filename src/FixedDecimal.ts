export type RoundingMode = 0 | 1 | 2 | 3;
export type Comparison = -1 | 0 | 1;

export namespace FixedDecimal {
  export type Value = string | number | bigint | FixedDecimal;
}
/**
 *  FixedDecimal Configuration System
 */
export interface FixedDecimalConfig {
  /**
   * Number of decimal places to use (1-20)
   * @default 8
   */
  places: number;

  /**
   * Default rounding mode for decimal operations
   * 0: Round down (floor)
   * 1: Round to nearest (symmetric)
   * 2: Round up (ceil)
   * 3: Round towards zero (truncate)
   * @default 1
   */
  roundingMode?: RoundingMode;
}

export default class FixedDecimal {
  private value: bigint;

  /**
   * Formatting settings.
   * By default, uses 8 decimal places and symmetric rounding (1).
   */
  public static format = {
    places: 8,
    roundingMode: 1 as RoundingMode,
  };
  // Pre-calculate the scale factor
  private static SCALE: bigint = 10n ** BigInt(FixedDecimal.format.places);
  private static SCALENUMBER: number = 10 ** FixedDecimal.format.places;

  /**
   * Configures the FixedDecimal library.
   * @param config - FixedDecimal configuration
   */
  public static configure(config: FixedDecimalConfig): void {
    // Validate decimal places
    if (config.places !== undefined) {
      if (
        !Number.isInteger(config.places) ||
        config.places < 1 ||
        config.places > 20
      ) {
        throw new Error("Decimal places must be an integer between 1 and 20");
      }

      FixedDecimal.format.places = config.places;
      // Update the scale factors when places change
      FixedDecimal.SCALE = 10n ** BigInt(config.places);
      FixedDecimal.SCALENUMBER = 10 ** config.places;
    }
    // Validate rounding mode
    if (config.roundingMode !== undefined) {
      if (![0, 1, 2, 3].includes(config.roundingMode)) {
        throw new Error("Invalid rounding mode. Must be 0, 1, 2, or 3");
      }
      FixedDecimal.format.roundingMode = config.roundingMode;
    }
  }

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
   * Helper method to create a FixedDecimal instance from a raw, already scaled bigint.
   * @param rawValue - The raw bigint value.
   * @returns A new FixedDecimal instance with the internal value set to rawValue.
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
      let abs = 1;
      if (integerPart[0] === "-") {
        abs = -1;
      }
      return BigInt(
        Number(integerPart) * FixedDecimal.SCALENUMBER + abs * decimal
      );
    }
    let abs = 1n;
    if (integerPart[0] === "-") {
      abs = -1n;
    }
    const decimal =
      len === FixedDecimal.format.places
        ? BigInt(decimalPart)
        : BigInt(decimalPart) *
          BigInt(10 ** (FixedDecimal.format.places - len));
    return BigInt(integerPart) * FixedDecimal.SCALE + abs * decimal;
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
    const abs = value < 0n ? 0 : 1;
    const s = value.toString();
    const intPart = abs
      ? s.slice(0, -FixedDecimal.format.places) || "0"
      : s.slice(1, -FixedDecimal.format.places) || "0";
    let fracPart = s.slice(-FixedDecimal.format.places); //.replace(/0+$/, "");
    if (fracPart.length < FixedDecimal.format.places) {
      fracPart = fracPart.padStart(FixedDecimal.format.places, "0");
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

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Arithmetic methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  /** Returns a FixedDecimal whose value is the absolute value of this FixedDecimal. */
  public abs(): FixedDecimal {
    return FixedDecimal.fromRaw(this.value < 0n ? -this.value : this.value);
  }

  /** Returns a FixedDecimal whose value is this FixedDecimal plus n. */
  public add(other: FixedDecimal): FixedDecimal {
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

  public isZero(): boolean {
    return this.value === 0n;
  }

  public isPositive(): boolean {
    return this.value > 0n;
  }

  public isNegative(): boolean {
    return this.value < 0n;
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
    const result = FixedDecimal.fromRaw(this.value ** BigInt(exp));
    return exp < 0 ? new FixedDecimal(1n).div(result) : result;
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

  /**
   * Returns a JSON representation of this FixedDecimal (its string value).
   */
  public toJSON(): string {
    return this.toString();
  }

    /**
   * Returns a new FixedDecimal representing the ceiling of this value.
   * For positive numbers, rounds up; for negatives, rounds toward zero.
   */
    public ceil(): FixedDecimal {
      // Using ROUND_CEIL (2)
      return this.round(0, 2);
    }
  
    /**
     * Returns a new FixedDecimal representing the floor of this value.
     * For positive numbers, rounds down; for negatives, rounds away from zero.
     */
    public floor(): FixedDecimal {
      // Using ROUND_FLOOR (3)
      return this.round(0, 3);
    }
  
    /**
     * Returns a new FixedDecimal representing the value truncated toward zero.
     */
    public trunc(): FixedDecimal {
      // Using ROUND_DOWN (1)
      return this.round(0, 1);
    }

  /**
   * Returns a new FixedDecimal with the value rounded to the specified number of decimal places.
   *
   * @param dp - Desired number of decimal places (default: FixedDecimal.format.places)
   * @param rm - Rounding mode (default: FixedDecimal.format.roundingMode)
   * @returns A new FixedDecimal instance with the rounded value.
   */
  public round(
    dp: number = FixedDecimal.format.places,
    rm: RoundingMode = FixedDecimal.format.roundingMode
  ): FixedDecimal {
    if (dp < 0 || dp > FixedDecimal.format.places) {
      throw new Error(
        `Decimal places (dp) must be between 0 and ${FixedDecimal.format.places}`
      );
    }
    const diff = FixedDecimal.format.places - dp;
    const factor = 10n ** BigInt(diff);
    const rounded = this.roundToScale(factor, rm);
    const newValue = rounded * factor;
    return FixedDecimal.fromRaw(newValue);
  }
  
   /**
   * Returns a new FixedDecimal with its value shifted by n decimal places.
   * A positive n shifts to the left (multiplication), negative to the right (division).
   *
   * The operation is exact; if a negative shift does not divide evenly, an error is thrown.
   *
   * @param n - The number of places to shift.
   * @returns A new FixedDecimal instance with the shifted value.
   */
   public shiftedBy(n: number): FixedDecimal {
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
    return FixedDecimal.fromRaw(newRaw);
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Formatting methods
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  /**
   * Rounds the internal value according to the given scaling factor and rounding mode.
   *
   * @param roundingFactor - Factor to round by (equivalent to 10^(number of discarded digits))
   * @param rm - Rounding mode to use
   * @returns The quotient after rounding (without the discarded digits)
   */
  private roundToScale(roundingFactor: bigint, rm: RoundingMode): bigint {
    switch (rm) {
      case 0: // Round down (floor)
        if (this.value >= 0n) {
          return this.value / roundingFactor;
        } else {
          let q = this.value / roundingFactor;
          if (this.value % roundingFactor !== 0n) {
            q = q - 1n;
          }
          return q;
        }
      case 1: // Round to nearest (half away from zero)
        if (this.value >= 0n) {
          return (this.value + roundingFactor / 2n) / roundingFactor;
        } else {
          return (this.value - roundingFactor / 2n) / roundingFactor;
        }
      case 2: // Round up (ceil)
        if (this.value >= 0n) {
          let q = this.value / roundingFactor;
          if (this.value % roundingFactor !== 0n) {
            q = q + 1n;
          }
          return q;
        } else {
          return this.value / roundingFactor;
        }
      case 3: // Round towards zero (truncate)
        return this.value / roundingFactor;
      default:
        throw new Error(`Rounding mode ${rm} is not supported.`);
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
    const rounded = this.roundToScale(factor, FixedDecimal.format.roundingMode);
    const newValue = rounded * factor;
    return FixedDecimal.fromRaw(newValue);
  }

  toExponential(dp: number = FixedDecimal.format.places, rm?: RoundingMode): string {
    const rounded = this.round(dp, rm);
    const [int, frac] = rounded.toString().split(".");
    const exp =
      int.length > 1
        ? int.length - 1
        : int === "0"
          ? -frac?.search(/[1-9]/) - 1
          : 0;
    const shifted = rounded.div(new FixedDecimal(10n ** BigInt(exp)));
    return `${shifted.toFixed(dp)}e${exp}`;
  }

  toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) {
      throw new Error("Invalid precision");
    }

    // const str = this.abs().toString().replace(".", "");
    // const len = str.replace(/0+$/, "").length;
    // if (len > sd) {
    //   return this.toExponential(sd - 1, rm);
    // }

    return this.round(
      sd - (Math.floor(Math.log10(this.toNumber())) + 1),
      rm
    ).toString().replace(/0+$/, "");
  }

  /**
   * Returns a string representing the FixedDecimal in normal notation
   * to a fixed number of decimal places.
   */
  public toFixed(
    places: number = 0,
    rm: RoundingMode = FixedDecimal.format.roundingMode
  ): string {
    const decPlaces =
      places !== undefined ? places : FixedDecimal.format.places;
    if (decPlaces < 0 || decPlaces > FixedDecimal.format.places) {
      throw new Error(
        `places must be between 0 and ${FixedDecimal.format.places}`
      );
    }
    const diff = FixedDecimal.format.places - decPlaces;
    const roundingFactor = 10n ** BigInt(diff);
    const scaled = this.roundToScale(roundingFactor, rm);
    const divisor = 10n ** BigInt(decPlaces);
    const intPart = scaled / divisor;
    const fracPart = (scaled % divisor).toString().padStart(decPlaces, "0");
    return decPlaces > 0
      ? `${intPart.toString()}.${fracPart}`
      : intPart.toString();
  }

  valueOf(): string {
    return this.toString();
  }
}

/**
 * Setup helper
 * Usage example:
 *
 *   import FixedDecimal, { fixedconfig } from './FixedDecimal';
 *   fixedconfig.configure({ places: 4, roundingMode: 1 });
 */
export const fixedconfig = {
  configure: FixedDecimal.configure.bind(FixedDecimal),
};
