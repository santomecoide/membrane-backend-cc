import signalr from 'node-signalr'
import zlib from 'zlib'
import { type SocketRepository } from '../domain/socket.repository'
import { type SocketOptionsEntity } from '../domain/socketoptions.entity'
import { type OrderbookEntity, type BidEntity, type AskEntity } from '../domain/orderbook.entity'

const url = 'https://socket-v3.bittrex.com/signalr'
const hub = ['c3']

class BittrexSocket implements SocketRepository {
  private options: SocketOptionsEntity

  async connect (options: SocketOptionsEntity): Promise<signalr.Client> {
    this.options = options
    const client = new signalr.Client(url, hub)

    await new Promise((resolve, reject) => {
      client.on('connected', () => {
        console.log('client connected')
        resolve(true)
      })

      client.on('error', err => {
        reject(new Error('client connect error: ' + err.code))
      })

      client.start()
    })

    const channels = channelsMap(this.options)[0]
    await client.connection.hub.call(hub[0], 'subscribe', channels)

    return client
  }

  disconnect (client: signalr.Client): void {
    client.end()
    console.log('client disconnected')
  }

  async message (client: signalr.Client): Promise<any> {
    const channels = channelsMap(this.options)[1]
    let data = {}
    for (const channel of channels) {
      const channelResult = await new Promise(resolve => {
        client.connection.hub.on(hub[0], channel, (message: any) => {
          const raw = Buffer.from(message, 'base64')
          zlib.inflateRaw(raw, (err, inflated) => {
            if (err === null) {
              resolve(JSON.parse(inflated.toString('utf8')))
            }
          })
        })
      })
      data = { ...channelResult as object, ...data }
    }
    return parseMessageData(data)
  }
}

const channelsMap = (options: SocketOptionsEntity): object => {
  const { pairName } = options

  const chanels = [
    [`orderbook_${pairName}_1`, 'orderBook']
  ]

  return [
    chanels.map(c => c[0]),
    chanels.map(c => c[1])
  ]
}

const parseMessageData = (messageData: any): OrderbookEntity => {
  const orderbookEntity: OrderbookEntity = {
    pairName: messageData.marketSymbol,
    bids: messageData.bidDeltas.map((bidDelta): BidEntity => ({
      amount: bidDelta.quantity,
      price: bidDelta.rate
    })),
    asks: messageData.askDeltas.map((askDelta): AskEntity => ({
      amount: askDelta.quantity,
      price: askDelta.rate
    }))
  }

  return orderbookEntity
}

export {
  BittrexSocket
}
