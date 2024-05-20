import {
  ExchangeContract,
  ExchangeContract_type_id_12,
  makerOrderEntity,
} from "generated";
import { nanoid } from "nanoid";

function tai64ToDate(tai64: bigint) {
  const dateStr = (
    (tai64 - BigInt(Math.pow(2, 62)) - BigInt(10)) *
    1000n
  ).toString();
  return new Date(+dateStr).toUTCString();
}

function decodeMarketOrder(
  eventOrder: ExchangeContract_type_id_12
): makerOrderEntity {
  return {
    id: nanoid(),
    side: eventOrder.side.case,
    maker: eventOrder.maker.value,
    collection: eventOrder.collection.value,
    token_id: eventOrder.token_id,
    price: eventOrder.price,
    amount: eventOrder.amount,
    nonce: eventOrder.nonce,
    strategy: eventOrder.strategy.value,
    payment_asset: eventOrder.payment_asset.value,
    start_time: tai64ToDate(eventOrder.start_time),
    end_time: tai64ToDate(eventOrder.end_time),
  };
}

ExchangeContract.OrderPlaced.loader(({ event, context }) => {});

ExchangeContract.OrderPlaced.handler(({ event, context }) => {
  const makerOrder = decodeMarketOrder(event.data.order);
  context.OrderPlaced.set({
    id: nanoid(),
    order_id: makerOrder.id,
  });
  context.MakerOrder.set(makerOrder);
});

ExchangeContract.OrderUpdated.loader(({ event, context }) => {});

ExchangeContract.OrderUpdated.handler(({ event, context }) => {
  const makerOrder = decodeMarketOrder(event.data.order);
  context.OrderUpdated.set({
    id: nanoid(),
    order_id: makerOrder.id,
  });
  context.MakerOrder.set(makerOrder);
});
