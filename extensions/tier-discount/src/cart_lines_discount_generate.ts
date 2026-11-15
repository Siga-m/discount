import {
  CartInput,
  CartLine,
  CartLinesDiscountsGenerateRunResult,
  CartOperation,
  OrderDiscountSelectionStrategy,
} from "../generated/api";

export function cartOrderDiscount(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  const operations: CartOperation[] = [];
  const Discount = input.discount.metafield?.jsonValue ?? "10";
  operations.push({
    orderDiscountsAdd: {
      candidates: [
        {
          message: "My first Discount",
          targets: [
            {
              orderSubtotal: {
                excludedCartLineIds: [],
              },
            },
          ],
          value: {
            percentage: {
              value: Discount.toString(),
            },
          },
        },
      ],
      "selectionStrategy": OrderDiscountSelectionStrategy.First
    },
  });
  return {operations};
}
