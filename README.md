# membrane-backend-cc
Cripto Market Status API REST

- This backend consume data from Bittrex API external exchange via websocket stream
- only support BTC-USD and ETH-USD


# REST API

## Get Orderbook

### Request

`GET /v1/orderbook?pairName=`

    curl -i -H 'Accept: application/json' http://host:port/v1/orderbook?pairName=

### Response
    {
      "pairName": string,
      "bids": [ { "amount": number, "price": number } ],
      "asks": [ { "amount": number, "price": number } ],
    }

## Effective Price

### Request

`POST /v1/effectivePrice`

    curl -i -H 'Accept: application/json' -X POST -d 'pairName=&operationType=&amount=&effectivePriceLimit=' http://host:port/effectivePrice

### Response
    {
      "effective price": number
    }
