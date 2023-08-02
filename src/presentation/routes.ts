import { Router } from 'express'

import { SocketService } from '../aplication/socket.service'
import { BittrexSocket } from '../infraestructure/bittrex.socket'
import { type SocketOptionsEntity } from '../domain/socketoptions.entity'

const router = Router()
const bittrexSocket = new BittrexSocket()
const socketService = new SocketService(bittrexSocket)

router.get('/orderbook', (req, res) => {
  const proxyConnectOptions: SocketOptionsEntity = {
    pairName: req.query.pairName?.toString() ?? ''
  }

  socketService.connect(proxyConnectOptions)
    .then(async client => {
      const message = await socketService.orderbookMessage(client)
      socketService.discconect(client)
      res.status(200).send(message)
    })
    .catch(err => {
      let status = 500
      if (err.name === 'TypeError') status = 400
      res.status(status).send(err.message)
    })
})

router.post('/effectivePrice', (req, res) => {
  const proxyConnectOptions: SocketOptionsEntity = {
    pairName: req.body.pairName ?? '',
    operationType: req.body.operationType ?? '',
    amount: req.body.amount ?? 0,
    effectivePriceLimit: req.body.effectivePriceLimit ?? null
  }

  socketService.connect(proxyConnectOptions)
    .then(async client => {
      const message = await socketService.effectivePriceMessage(client)
      socketService.discconect(client)
      res.status(200).send({ 'effective price': message })
    })
    .catch(err => {
      let status = 500
      if (err.name === 'TypeError') status = 400
      res.status(status).send(err.message)
    })
})

export {
  router
}
