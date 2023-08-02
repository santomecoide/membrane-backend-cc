import { type SocketRepository } from '../domain/socket.repository'
import { type SocketOptionsEntity } from '../domain/socketoptions.entity'
import { type OrderbookEntity } from '../domain/orderbook.entity'
import { effectivePriceStatement, limitAmountStatment } from '../domain/effectiveeprice.statment'

const pairNamesSupported = ['BTC-USD', 'ETH-USD']
const operationTypesSupported = ['buy', 'sell']

class SocketService {
  constructor (private readonly socketRepository: SocketRepository) {}

  private options

  public connect = async (options: SocketOptionsEntity): Promise<object> => {
    this.options = options

    if (pairNamesSupported.findIndex(rule => rule === this.options.pairName) === -1) {
      throw new TypeError('pairName not supported')
    }

    if (
      this.options.operationType != null &&
      operationTypesSupported.findIndex(rule => rule === this.options.operationType) === -1
    ) {
      throw new TypeError('operationType not supported')
    }

    return await this.socketRepository.connect(this.options)
  }

  public discconect = (client: object): void => {
    this.socketRepository.disconnect(client)
  }

  public orderbookMessage = async (client: object): Promise<OrderbookEntity> => {
    return await this.socketRepository.message(client)
  }

  public effectivePriceMessage = async (client: object): Promise<number> => {
    const orderbook: OrderbookEntity = await this.socketRepository.message(client)
    if (orderbook.bids.length <= 0 && this.options.operationType === 'buy') {
      throw new TypeError('bid list are empty')
    }
    if (orderbook.asks.length <= 0 && this.options.operationType === 'sell') {
      throw new TypeError('ask list are empty')
    }

    const effectivePrice = effectivePriceStatement(this.options.operationType, this.options.amount, orderbook)
    if (
      this.options.effectivePriceLimit != null &&
      effectivePrice > this.options.effectivePriceLimit
    ) {
      const limitAmount = limitAmountStatment(this.options.operationType, this.options.effectivePriceLimit, orderbook)
      throw new TypeError(`effective Price gretter than limit, only can buy ${limitAmount}`)
    }

    return effectivePrice
  }
}

export {
  SocketService
}
