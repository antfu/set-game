var express = require('express')
var router = express.Router()

router.use('/ws', require('./websocket'))

router.get('/', function (req, res) {
  res.redirect('/solo')
})

router.get('/help', function (req, res) {
  res.render('help')
})

router.get('/solo', function (req, res) {
  res.render('index', { mode: 'local' })
})

router.get('/room/:room/player/:player', function (req, res) {
  res.render('index', { mode: 'web', room: req.params.room, player: req.params.player })
})

module.exports = router
