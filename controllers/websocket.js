var express = require('express')
var router = express.Router()
var SetGame = require('../game/set')

var rooms = {}

router.ws('/echo', function (ws, req) {
  ws.on('message', function (msg) {
    ws.send(msg);
  });
})

router.ws('/room/:room', function (ws, req) {
  var room = rooms[req.params.room] = rooms[req.params.room] || new SetGame(req.params.room)

  ws.on('message', function (msg) {
    ws.send(msg);
  });

  ws.send('Hello')
})

module.exports = router
