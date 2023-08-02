interface OrderbookEntity {
  pairName: string
  bids: BidEntity[]
  asks: AskEntity[]
}

interface BidEntity {
  amount: number
  price: number
}

interface AskEntity {
  amount: number
  price: number
}

export type {
  OrderbookEntity,
  BidEntity,
  AskEntity
}
