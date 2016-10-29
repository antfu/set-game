var express = require('express')
var router = express.Router()
var SetGame = require('../game/set')

var rooms = {}

router.ws('/echo', function (ws, req) {
  ws.on('message', function (msg) {
    ws.send(msg);
  });
})

router.ws('/room/:room/player/:player', function (ws, req) {
  var room = rooms[req.params.room] = rooms[req.params.room] || new SetGame(req.params.room)
  var send = obj => {
    ws.send(JSON.stringify(obj))
  }

  ws.on('message', function (e) {
    console.log('WS: Message:' + e)
    var msg = JSON.parse(e)
    var respond = { repeat: msg }
    if (msg.test)
      respond.ground = [1111, 2132, 3333, 1232, 2231]

    send(respond)
  });

  send({ ping: 'Hello' })
  send({
    update: {
      solved: 12,
      deck_amount: room.deck.length,
      amount: room.amount
    },
    ground: room.ground
  })
})

module.exports = router
