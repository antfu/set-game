var express = require('express')
var router = express.Router()
var SetGame = require('../game/set')

var rooms = {}

router.ws('/echo', function (ws, req) {
  ws.on('message', function (msg) {
    ws.send(msg)
  });
})

router.ws('/room/:room/player/:player', function (ws, req) {
  var room = rooms[req.params.room] = rooms[req.params.room] || new SetGame(req.params.room)
  var player = room.get_player(req.params.player)

  player.bind_ws(ws)

  var send = obj => {
    ws.send(JSON.stringify(obj))
  }

  ws.on('message', function (e) {
    console.log('WS: Message:' + e)
    var msg = JSON.parse(e)
    if (msg.play)
      room.set(msg.play, player)
    if (msg.restart)
      room.start()
  });

  send(room.all())
})

module.exports = router
