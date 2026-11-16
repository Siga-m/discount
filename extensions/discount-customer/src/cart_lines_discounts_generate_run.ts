import {
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  CartOperation,
  OrderDiscountSelectionStrategy,
} from "../generated/api";


const discount = {message: "Regular", value: "5"}
export function cartLinesDiscountsGenerateRun(input:CartInput): CartLinesDiscountsGenerateRunResult {
  const operations: CartOperation[] = [];
  const vipcustomer = input.cart.buyerIdentity?.customer?.hasTags.some(tag => tag.hasTag )
 const Isnewcustomer = ( input.cart.buyerIdentity?.customer?.numberOfOrders ?? 0) > 0 ? false : true;
if (vipcustomer){
  discount.message = "VIP customer"
  discount.value = "15"
} else if (Isnewcustomer && input.cart.buyerIdentity) {
  discount.message = "new customer"
  discount.value = "10"
}
  operations.push({
    orderDiscountsAdd: {
      candidates: [
        {
          message: discount.message,
          value: {
            percentage: {
              value: discount.value,
            },
          },
          targets: [
            {
              orderSubtotal: {
                excludedCartLineIds: [],
              },
            },
          ],
        },
      ],
      "selectionStrategy" :OrderDiscountSelectionStrategy.First
    },
  });

  return {operations};
}
