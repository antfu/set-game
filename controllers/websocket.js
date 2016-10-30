var express = require('express')
var router = express.Router()
var SetGame = require('../game/set')

var rooms = {}

router.ws('/r/:room/p/:player', function (ws, req) {
  var room = rooms[req.params.room] = rooms[req.params.room] || new SetGame(req.params.room)
  var player = room.get_player(req.params.player)

  player.bind_ws(ws)

  ws.on('message', function (e) {
    console.log('INFO ws message:' + e)
    try {
      var msg = JSON.parse(e)
    } catch (e) {
      console.log('ERROR parsing message from client', e)
      return
    }
    if (msg.play)
      room.set(msg.play, player)
    if (msg.restart)
      room.start()
  });

  room.boardcast({ players: room.player_amount() })
  player.send_info()
})

module.exports = router
