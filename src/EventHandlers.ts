import { ExchangeContract, makerOrderEntity } from "generated";
import { nanoid } from "nanoid";

function tai64ToDate(tai64: bigint) {
  const dateStr = (
    (tai64 - BigInt(Math.pow(2, 62)) - BigInt(10)) *
    1000n
  ).toString();
  return new Date(+dateStr).toUTCString();
}

ExchangeContract.OrderPlaced.loader(({ event, context }) => {});

ExchangeContract.OrderPlaced.handler(({ event, context }) => {
  const eOrder = event.data.order;
  const makerOrder: makerOrderEntity = {
    id: nanoid(),
    side: eOrder.side.case,
    maker: eOrder.maker.value,
    collection: eOrder.collection.value,
    token_id: eOrder.token_id,
    price: eOrder.price,
    amount: eOrder.amount,
    nonce: eOrder.nonce,
    strategy: eOrder.strategy.value,
    payment_asset: eOrder.payment_asset.value,
    start_time: tai64ToDate(eOrder.start_time),
    end_time: tai64ToDate(eOrder.end_time),
  };

  context.OrderPlaced.set({
    id: nanoid(),
    order_id: makerOrder.id,
  });
  context.MakerOrder.set(makerOrder);
});
