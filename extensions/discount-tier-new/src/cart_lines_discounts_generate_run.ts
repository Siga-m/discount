import {
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  CartOperation,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
} from "../generated/api";

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  const operations: CartOperation[] = [];
  const excudeProduct = ["Saunf Rusk", "Choker with Triangle"];
  const excludedCartLineIds = input.cart.lines.filter(item => item.merchandise.__typename == "ProductVariant" && excudeProduct.includes(item.merchandise.product.title)).map(line => line.id)
  const Tiers = [
    {
      throshold: 2000,
      percentage: 10,
    },
    {
      throshold: 5000,
      percentage: 15,
    },
    {
      throshold: 10000,
      percentage: 20,
    },
  ];

  const subtotal = input.cart.cost.subtotalAmount.amount;
   const eligiblepercentage = [...Tiers]
   .reverse()
    .find((tier) => +subtotal >= tier.throshold)?.percentage;
    if(eligiblepercentage){
  operations.push({
    "productDiscountsAdd":{
      "candidates":[
        {
          "message":`${eligiblepercentage}% Discount`,
          "value": {
            "percentage":{
              "value": eligiblepercentage?.toString()
            }
          },
          targets:input.cart.lines.map(line =>{
            return {"cartLine":{
              "id":line.id
            }}
          })
        }
      ],
      "selectionStrategy": ProductDiscountSelectionStrategy.All
    }
  })
  }

  // operations.push({
  //   "orderDiscountsAdd":{
  //     "candidates": [
  //         {
  //           message: "5% Discount",
  //           value: {
  //             percentage: {
  //               value: "5",
  //             },
  //           },
  //           targets: [
  //             {
  //               orderSubtotal: {
  //                 excludedCartLineIds: [],
  //               },
  //             },
  //           ],
  //           "conditions":[{
  //             "cartLineMinimumQuantity":{
  //               "minimumQuantity": 5,
  //               ids: excludedCartLineIds
  //             }

  //           },
  //           {
  //             "orderMinimumSubtotal":{
  //               "minimumAmount": "7000",
  //               "excludedCartLineIds":[]
  //             }
  //           }
  //         ]
  //         },
  //         // {
  //         //   message: "10% Discount",
  //         //   value: {
  //         //     percentage: {
  //         //       value: "10",
  //         //     },
  //         //   },
  //         //   targets: [
  //         //     {
  //         //       orderSubtotal: {
  //         //         excludedCartLineIds: [],
  //         //       },
  //         //     },
  //         //   ],
  //         //   "conditions":[]
  //         // },
  //         // {
  //         //   message: "15% Discount",
  //         //   value: {
  //         //     percentage: {
  //         //       value: "15",
  //         //     },
  //         //   },
  //         //   targets: [
  //         //     {
  //         //       orderSubtotal: {
  //         //         excludedCartLineIds: [],
  //         //       },
  //         //     },
  //         //   ],
  //         //   "conditions":[]
  //         // }
  //       ],
  //       "selectionStrategy": OrderDiscountSelectionStrategy.Maximum
  //   }
  // })
  // const subtotal = input.cart.cost.subtotalAmount.amount;
  // const eligiblepercentage = [...Tiers]
  //   .reverse()
  //   .find((tier) => +subtotal >= tier.throshold)?.percentage;
  // if (eligiblepercentage) {
  //   operations.push({
  //     orderDiscountsAdd: {
  //       candidates: [
  //         {
  //           message: `${eligiblepercentage}% Discount`,
  //           value: {
  //             percentage: {
  //               value: eligiblepercentage.toString(),
  //             },
  //           },
  //           targets: [
  //             {
  //               orderSubtotal: {
  //                 excludedCartLineIds: [],
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //       "selectionStrategy":OrderDiscountSelectionStrategy.First
  //     },
  //   });
  // }
  return{ operations}
}
