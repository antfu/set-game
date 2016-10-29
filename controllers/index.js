var express = require('express')
  , router = express.Router()

router.use('/ws', require('./websocket'))

router.get('/', function(req, res) {
  res.render('index')
})

router.get('/help', function(req, res) {
  res.render('help')
})

module.exports = router
