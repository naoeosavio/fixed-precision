import { FactoryContext } from "./context";
import type {
  FixedPrecisionConfig,
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "./types";
import { construct } from "./value";

export function createFactory(
  config: FixedPrecisionConfig,
): (value: FixedPrecisionOperand) => FixedPrecisionData {
  const ctx = FactoryContext(config);
  return (value: FixedPrecisionOperand) => construct(value, ctx);
}
