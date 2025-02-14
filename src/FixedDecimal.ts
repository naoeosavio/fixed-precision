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
    places: 8n,
  };

  constructor(val: FixedDecimal.Value) {
    if (val instanceof FixedDecimal) {
      this.value = val.value;
    } else if (typeof val === "bigint") {
      this.value = val;
    } else if (typeof val === "string") {
      this.value = FixedDecimal.fromString(val);
    } else if (typeof val === "number") {
      this.value = FixedDecimal.fromNumber(val);
    } else {
      throw new Error("Invalid type for FixedDecimal");
    }
  }

  // Converts a string (with up to 8 decimal places) to bigint
  static fromString(value: string): bigint {
    return BigInt(
      (Number(value) *  (10 ** Number(FixedDecimal.format.places))).toFixed()
    );
  }

  // Converts a number to bigint
  static fromNumber(value: number): bigint {
    return BigInt((value *  (10 ** Number(FixedDecimal.format.places))).toFixed());
  }

  // Converts a bigint to number (restoring the fractional part)
  static toNumber(value: bigint): number {
    return Number(value) /  (10 ** Number(FixedDecimal.format.places));
  }

  // Converts a bigint to string (decimal format)
  static toString(value: bigint): string {
    return FixedDecimal.toNumber(value).toString();
  }

  // Instance methods for conversion
  public toNumber(): number {
    return FixedDecimal.toNumber(this.value);
  }

  public toString(): string {
    return FixedDecimal.toString(this.value);
  }

  // Arithmetic operations (return new instances)
  public add(other: FixedDecimal): FixedDecimal {
    return new FixedDecimal(this.value + other.value);
  }

  public sub(other: FixedDecimal): FixedDecimal {
    return new FixedDecimal(this.value - other.value);
  }

  public mul(other: FixedDecimal): FixedDecimal {
    return new FixedDecimal(
      (this.value * other.value) / (10n ** FixedDecimal.format.places)
    );
  }

  public div(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }
    return new FixedDecimal(
      (this.value * (10n ** FixedDecimal.format.places)) / other.value
    );
  }

  public mod(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero in modulus");
    }
    return new FixedDecimal(
      (this.value * (10n ** FixedDecimal.format.places)) % other.value
    );
  }

  public times(other: FixedDecimal): FixedDecimal {
    return new FixedDecimal(this.value * other.value);
  }

  public ratio(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }
    return new FixedDecimal(this.value / other.value);
  }

  public divMod(other: FixedDecimal): { div: FixedDecimal; mod: FixedDecimal } {
    if (other.value === 0n) {
      throw new Error("Division by zero in divMod");
    }
    const quotient = (this.value * (10n ** FixedDecimal.format.places)) / other.value;
    const remainder = (this.value * (10n ** FixedDecimal.format.places)) % other.value;
    return {
      div: new FixedDecimal(quotient),
      mod: new FixedDecimal(remainder),
    };
  }

  ////////////////////////////////////////////////////////////////////////////
  // Formatting and scale adjustment methods
  ////////////////////////////////////////////////////////////////////////////

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
   * The parameter newScale must be between 0 and 8.
   *
   * Example:
   *    new FixedDecimal("1.23456789").scale(2)  // represents 1.23
   */
  public scale(newScale: number): FixedDecimal {
    if (newScale < 0 || newScale > 8) {
      throw new Error("newScale must be between 0 and 8");
    }
    const diff = 8 - newScale;
    const factor = 10n ** BigInt(diff);
    // Round the value so that digits below newScale are discarded
    const rounded = this.roundToScale(factor);
    // Multiply back to maintain internal representation with FACTOR = 1e8,
    // but with lower digits zeroed out.
    const newValue = rounded * factor;
    return new FixedDecimal(newValue);
  }

  /**
   * Returns a string with the number formatted with fixed decimal places.
   * If the parameter places is not provided, it uses BigInt(FixedDecimal.format.places).
   *
   * Example:
   *    new FixedDecimal("1234.56789").toFixed(2)  // "1234.57"
   */
  public toFixed(places?: number): string {
    const decPlaces =
      places !== undefined ? places : Number(FixedDecimal.format.places);
    if (decPlaces < 0 || decPlaces > 8) {
      throw new Error("places must be between 0 and 8");
    }
    const diff = 8 - decPlaces;
    const roundingFactor = 10n ** BigInt(diff);
    // Get the rounded value at the new scale (as an integer representing value * 10^(places))
    const scaled = this.roundToScale(roundingFactor);
    const divisor = 10n ** BigInt(decPlaces);
    const intPart = scaled / divisor;
    const fracPart = (scaled % divisor).toString().padStart(decPlaces, "0");
    return decPlaces > 0
      ? `${intPart.toString()}.${fracPart}`
      : intPart.toString();
  }
}
