import { type OrderbookEntity } from './orderbook.entity'
import { type SocketOptionsEntity } from './socketoptions.entity'

interface SocketRepository {
  connect: (options: SocketOptionsEntity) => Promise<object>
  disconnect: (client: object) => void
  message: (client: object) => Promise<OrderbookEntity>
}

export type {
  SocketRepository
}
