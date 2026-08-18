import type {
  FixedPrecisionConfig,
  FixedPrecisionValue,
} from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { FactoryContext } from "./core/context";

export function createFactory(
  config: FixedPrecisionConfig,
): (value: FixedPrecisionValue) => FixedPrecision {
  const ctx = FactoryContext(config);
  return (value: FixedPrecisionValue) => new FixedPrecision(value, ctx);
}
