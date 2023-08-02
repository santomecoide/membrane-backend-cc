import { type AskEntity, type BidEntity, type OrderbookEntity } from './orderbook.entity'

const reduceTotal = (accumulator: number, currentValue: BidEntity | AskEntity): number =>
  accumulator + (currentValue.amount * currentValue.price)

const reduceAmount = (accumulator: number, currentValue: BidEntity | AskEntity): number =>
  accumulator + currentValue.amount

const effectivePriceStatement = (operationType: string, amount: number, orderbook: OrderbookEntity): number => {
  const operationTypeMap = {
    buy: () => {
      const totalBidsSum = orderbook.bids.reduce(reduceTotal, 0)
      const amountBidsSum = orderbook.bids.reduce(reduceAmount, 0)
      return amount * totalBidsSum / amountBidsSum
    },
    sell: () => {
      const totalAsksSum = orderbook.asks.reduce(reduceTotal, 0)
      const amountAsksSum = orderbook.asks.reduce(reduceAmount, 0)
      return amount * totalAsksSum / amountAsksSum
    }
  }

  return operationTypeMap[operationType]()
}

const limitAmountStatment = (operationType: string, effectivePriceLimit: number, orderbook: OrderbookEntity): number => {
  const operationTypeMap = {
    buy: () => {
      const totalBidsSum = orderbook.bids.reduce(reduceTotal, 0)
      const amountBidsSum = orderbook.bids.reduce(reduceAmount, 0)
      return effectivePriceLimit * amountBidsSum / totalBidsSum
    },
    sell: () => {
      const totalAsksSum = orderbook.asks.reduce(reduceTotal, 0)
      const amountAsksSum = orderbook.asks.reduce(reduceAmount, 0)
      return effectivePriceLimit * amountAsksSum / totalAsksSum
    }
  }

  return operationTypeMap[operationType]()
}

export {
  effectivePriceStatement,
  limitAmountStatment
}
