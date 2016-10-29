var express = require('express')
var router = express.Router()
var randname = require('../assert/name.js').randname

router.use('/ws', require('./websocket'))

router.get('/', function (req, res) {
  res.redirect('/s')
})

router.get('/r', function (req, res) {
  res.redirect('/r/default')
})

router.get('/help', function (req, res) {
  res.render('help')
})

router.get('/s', function (req, res) {
  res.render('index', { mode: 'local' })
})

router.get('/r/:room', function (req, res) {
  res.redirect('/r/' + req.params.room + '/p/' + randname().toLowerCase())

})

router.get('/r/:room/p/:player', function (req, res) {
  res.render('index', { mode: 'web', room: req.params.room, player: req.params.player })
})

module.exports = router
