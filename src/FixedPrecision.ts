export type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Comparison = -1 | 0 | 1;

export type FixedPrecisionValue = string | number | bigint | FixedPrecision;

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
  private value: bigint;

  /**
   * Formatting settings.
   * By default, uses 8 decimal places and ROUND_HALF_UP rounding (4).
   */
  public static format = {
    places: 8,
    roundingMode: 4 as RoundingMode,
  };
  // Pre-calculate the scale factor
  private static SCALE: bigint = 10n ** BigInt(FixedPrecision.format.places);
  private static SCALENUMBER: number = 10 ** FixedPrecision.format.places;

  /**
   * Configures the FixedPrecision library.
   * @param config - FixedPrecision configuration
   */
  public static configure(config: FixedPrecisionConfig): void {
    // Validate decimal places
    if (config.places !== undefined) {
      if (
        !Number.isInteger(config.places) ||
        config.places < 0 ||
        config.places > 20
      ) {
        throw new Error('Decimal places must be an integer between 0 and 20');
      }

      FixedPrecision.format.places = config.places;
      // Update the scale factors when places change
      FixedPrecision.SCALE = 10n ** BigInt(config.places);
      FixedPrecision.SCALENUMBER = 10 ** config.places;
    }
    // Validate rounding mode
    if (config.roundingMode !== undefined) {
      if (![0, 1, 2, 3, 4, 5, 6, 7, 8].includes(config.roundingMode)) {
        throw new Error(
          'Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8',
        );
      }
      FixedPrecision.format.roundingMode = config.roundingMode;
    }
  }

  constructor(val: FixedPrecisionValue) {
    if (val instanceof FixedPrecision) {
      this.value = val.value;
    } else {
      switch (typeof val) {
        case 'bigint':
          this.value = val * FixedPrecision.SCALE;
          break;
        case 'number': {
          this.value = FixedPrecision.fromNumber(val);
          break;
        }
        case 'string':
          this.value = FixedPrecision.fromString(val);
          break;
        default:
          throw new Error('Tipo inválido para FixedPrecision');
      }
    }
  }

  /**
   * Helper method to create a FixedPrecision instance from a raw, already scaled bigint.
   * @param rawValue - The raw bigint value.
   * @returns A new FixedPrecision instance with the internal value set to rawValue.
   */
  private static fromRaw(rawValue: bigint): FixedPrecision {
    const instance = new FixedPrecision(0n);
    instance.value = rawValue;
    return instance;
  }

  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
  // Conversion helpers
  // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

  // Converts a string (with up to 8 decimal places) to bigint.
  static fromString(value: string): bigint {
    const dotIndex = value.split('.');
    if (dotIndex.length > 2) {
      throw new Error('Invalid decimal format');
    }
    const integerPart = dotIndex[0] || '0';
    if (dotIndex.length < 2) {
      // No decimal part: multiply by 10^places.
      if (integerPart.length + FixedPrecision.format.places < 16) {
        return BigInt(Number(integerPart) * FixedPrecision.SCALENUMBER);
      }
      return BigInt(integerPart) * FixedPrecision.SCALE;
    }
    let decimalPart = dotIndex[1] || '0';

    let len = decimalPart.length;
    if (len > FixedPrecision.format.places) {
      decimalPart = decimalPart.slice(0, FixedPrecision.format.places);
      len = FixedPrecision.format.places;
    }
    if (integerPart.length + FixedPrecision.format.places < 16) {
      const decimal =
        len === FixedPrecision.format.places
          ? Number(decimalPart)
          : Number(decimalPart) * 10 ** (FixedPrecision.format.places - len);
      let abs = 1;
      if (integerPart[0] === '-') {
        abs = -1;
      }
      return BigInt(
        Number(integerPart) * FixedPrecision.SCALENUMBER + abs * decimal,
      );
    }
    let abs = 1n;
    if (integerPart[0] === '-') {
      abs = -1n;
    }
    const decimal =
      len === FixedPrecision.format.places
        ? BigInt(decimalPart)
        : BigInt(decimalPart) *
          BigInt(10 ** (FixedPrecision.format.places - len));
    return BigInt(integerPart) * FixedPrecision.SCALE + abs * decimal;
  }

  // Converts a number to bigint.
  static fromNumber(value: number): bigint {
    // Verify that the input is a finite number
    if (isNaN(value) || !isFinite(value)) {
      throw new Error('Invalid number: value must be a finite number.');
    }
    const scaled = value * FixedPrecision.SCALENUMBER;
    if (scaled > Number.MAX_SAFE_INTEGER || scaled < Number.MIN_SAFE_INTEGER) {
      throw new Error('Number out of safe range after scaling');
    }
    return BigInt(Math.floor(scaled));
  }

  // Converts an internal scaled BigInt to a number.
  static toNumber(value: bigint): number {
    return Number(value) / FixedPrecision.SCALENUMBER;
  }

  // Converts a raw bigint to string (in normal decimal notation).
  static toString(value: bigint): string {
    const abs = value < 0n ? 0 : 1;
    const s = value.toString();
    const intPart = abs
      ? s.slice(0, -FixedPrecision.format.places) || '0'
      : s.slice(1, -FixedPrecision.format.places) || '0';
    let fracPart = s.slice(-FixedPrecision.format.places); //.replace(/0+$/, "");
    if (fracPart.length < FixedPrecision.format.places) {
      fracPart = fracPart.padStart(FixedPrecision.format.places, '0');
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

  /** Returns a FixedPrecision whose value is this FixedPrecision plus n. */
  public add(other: FixedPrecision): FixedPrecision {
    return FixedPrecision.fromRaw(this.value + other.value);
  }

  /** Alias for add. */
  public plus(other: FixedPrecision): FixedPrecision {
    return this.add(other);
  }

  /** Compares the values.
   *  Returns -1 if this < other, 0 if equal, and 1 if this > other.
   */
  public cmp(other: FixedPrecision): Comparison {
    if (this.value < other.value) return -1;
    if (this.value > other.value) return 1;
    return 0;
  }

  /** Returns true if this FixedPrecision equals other. */
  public eq(other: FixedPrecision): boolean {
    return this.value === other.value;
  }

  /** Returns true if this FixedPrecision is greater than other. */
  public gt(other: FixedPrecision): boolean {
    return this.value > other.value;
  }

  /** Returns true if this FixedPrecision is greater than or equal to other. */
  public gte(other: FixedPrecision): boolean {
    return this.value >= other.value;
  }

  /** Returns true if this FixedPrecision is less than other. */
  public lt(other: FixedPrecision): boolean {
    return this.value < other.value;
  }

  /** Returns true if this FixedPrecision is less than or equal to other. */
  public lte(other: FixedPrecision): boolean {
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

  /** Returns a FixedPrecision whose value is this FixedPrecision minus n. */
  public sub(other: FixedPrecision): FixedPrecision {
    return FixedPrecision.fromRaw(this.value - other.value);
  }

  /** Alias for sub. */
  public minus(other: FixedPrecision): FixedPrecision {
    return this.sub(other);
  }

  /** Returns a FixedPrecision whose value is this FixedPrecision times n. */
  public mul(other: FixedPrecision): FixedPrecision {
    return FixedPrecision.fromRaw(
      (this.value * other.value) / FixedPrecision.SCALE,
    );
  }

  public product(other: FixedPrecision): FixedPrecision {
    return new FixedPrecision(this.value * other.value);
  }

  /** Returns a FixedPrecision whose value is this FixedPrecision divided by n. */
  public div(other: FixedPrecision): FixedPrecision {
    if (other.value === 0n) {
      throw new Error('Division by zero');
    }
    return FixedPrecision.fromRaw(
      (this.value * FixedPrecision.SCALE) / other.value,
    );
  }

  public fraction(other: FixedPrecision): FixedPrecision {
    if (other.value === 0n) {
      throw new Error('Division by zero');
    }
    return FixedPrecision.fromRaw(this.value / other.value);
  }

  /** Returns a FixedPrecision representing the integer remainder of dividing this by n. */
  public mod(other: FixedPrecision): FixedPrecision {
    if (other.value === 0n) {
      throw new Error('Division by zero in modulus');
    }
    return FixedPrecision.fromRaw(
      (this.value * FixedPrecision.SCALE) % other.value,
    );
  }
  public leftover(other: FixedPrecision): FixedPrecision {
    if (other.value === 0n) {
      throw new Error('Division by zero in modulus');
    }
    return FixedPrecision.fromRaw(this.value % other.value);
  }

  /** Returns a FixedPrecision whose value is the negation of this FixedPrecision. */
  public neg(): FixedPrecision {
    return FixedPrecision.fromRaw(-this.value);
  }

  /**
   * Returns a FixedPrecision whose value is this FixedPrecision raised to the power exp.
   * (Only integer exponents are supported.)
   */
  public pow(exp: number): FixedPrecision {
    if (!Number.isInteger(exp)) {
      throw new Error('Exponent must be an integer');
    }
    const result = FixedPrecision.fromRaw(
      this.value ** BigInt(Math.abs(exp)),
    ).div(
      FixedPrecision.fromRaw(FixedPrecision.SCALE ** BigInt(Math.abs(exp))),
    );
    return exp < 0 ? new FixedPrecision(1n).div(result) : result;
  }

  /**
   * Returns a FixedPrecision whose value is the square root of this FixedPrecision.
   * (For simplicity, we use Math.sqrt on the number value.)
   */
  public sqrt(): FixedPrecision {
    if (this.lt(new FixedPrecision(0n))) {
      throw new Error('Square root of negative number');
    }
    if (this.eq(new FixedPrecision(0n))) {
      return new FixedPrecision(0n);
    }
    // Initial guess: x / 2.0
    const initialGuess = this.div(new FixedPrecision(2n));
    return this.sqrtGo(initialGuess, 10);
  }

  /**
   * Newton–Raphson iteration for square root.
   * @param guess Current approximation.
   * @param iter  Remaining iterations.
   * @returns Improved square root approximation.
   */
  private sqrtGo(guess: FixedPrecision, iter: number): FixedPrecision {
    if (iter === 0) {
      return guess;
    }
    // next = (guess + (x / guess)) / 2.0
    const next = guess.add(this.div(guess)).div(new FixedPrecision(2n));
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
        throw new Error('Inexact shift');
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
    const fracStr = randInt.toString().padStart(decimalPlaces, '0');
    const valueStr = '0.' + fracStr;
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
    const [int = '', frac = ''] = rounded.toString().split('.');
    const exp =
      int.length > 1
        ? int.length - 1
        : int === '0'
          ? -frac?.search(/[1-9]/) - 1
          : 0;
    const shifted = rounded.div(
      new FixedPrecision(10n ** BigInt(Math.abs(exp))),
    );
    return `${shifted.toFixed(dp)}e${exp}`;
  }

  toPrecision(sd: number, rm?: RoundingMode): string {
    if (sd >= 1e6) {
      throw new Error('Invalid precision');
    }
    return this.round(sd - (Math.floor(Math.log10(this.toNumber())) + 1), rm)
      .toString()
      .replace(/0+$/, '');
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
    const fracPart = (scaled % divisor).toString().padStart(decPlaces, '0');
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
 *   import FixedPrecision, { fixedconfig } from './FixedPrecision';
 *   fixedconfig.configure({ places: 8, roundingMode: 4 });
 */
export const fixedconfig = {
  configure: FixedPrecision.configure.bind(FixedPrecision),
};
