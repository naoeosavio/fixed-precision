import { FactoryContext } from "../../core/construction/context";
import type {
  FixedPrecisionConfig,
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { construct } from "../../core/construction/value";

export function createFactory(
  config: FixedPrecisionConfig,
): (value: FixedPrecisionOperand) => FixedPrecisionData {
  const ctx = FactoryContext(config);
  return (value: FixedPrecisionOperand) => construct(value, ctx);
}
