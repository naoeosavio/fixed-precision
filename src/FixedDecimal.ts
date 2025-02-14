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
    const dotIndex = value.indexOf(".");

    if (dotIndex === -1) {
      // No decimal part: multiply by 10^8
      return BigInt(value + "00000000");
    }

    // If there is more than one dot, throw an error
    if (value.indexOf(".", dotIndex + 1) !== -1) {
      throw new Error("Invalid decimal format");
    }

    // The integer part can be empty (e.g., ".123" → "0")
    const integerPart = value.slice(0, dotIndex) || "0";
    let decimalPart = value.slice(dotIndex + 1);
    const len = decimalPart.length;

    if (len < 8) {
      // Pad with trailing zeros if digits are missing
      decimalPart += "00000000".slice(len);
    } else if (len > 8) {
      // If there are more than 8 digits, truncate the excess
      decimalPart = decimalPart.slice(0, 8);
    }
    // Convert the parts to BigInt and perform the operation:
    return BigInt(integerPart + decimalPart);
  }
  // Converts a number to bigint
  static fromNumber(value: number): bigint {
    return BigInt((value * 10 ** FixedDecimal.format.places).toFixed());
  }

  // Converts a bigint to number (restoring the fractional part)
  static toNumber(value: bigint): number {
    return Number(value) / 10 ** FixedDecimal.format.places;
  }

  // Converts a bigint to string (decimal format)
  static toString(value: bigint): string {
    if (!value) {
      return "0";
    }
    const intPart = value / 10n ** BigInt(FixedDecimal.format.places);
    const fracPart = value % 10n ** BigInt(FixedDecimal.format.places);
    if (fracPart) {
      if (intPart > 9007199254740991n) {
        return (
          intPart +
          "." +
          Math.abs(Number(fracPart))
            .toString()
            .padStart(FixedDecimal.format.places, "0")
        );
      }

      return (
        Number(intPart) +
        "." +
        Math.abs(Number(fracPart))
          .toString()
          .padStart(FixedDecimal.format.places, "0")
      );
    }
    if (intPart > 9007199254740990n) {
      return intPart + ".00000000";
    }
    return Number(intPart) + ".00000000";
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
      (this.value * other.value) / 10n ** BigInt(FixedDecimal.format.places)
    );
  }

  public div(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }
    return new FixedDecimal(
      (this.value * 10n ** BigInt(FixedDecimal.format.places)) / other.value
    );
  }

  public mod(other: FixedDecimal): FixedDecimal {
    if (other.value === 0n) {
      throw new Error("Division by zero in modulus");
    }
    return new FixedDecimal(
      (this.value * 10n ** BigInt(FixedDecimal.format.places)) % other.value
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
    const quotient =
      (this.value * 10n ** BigInt(FixedDecimal.format.places)) / other.value;
    const remainder =
      (this.value * 10n ** BigInt(FixedDecimal.format.places)) % other.value;
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
