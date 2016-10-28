var express = require('express')
  , router = express.Router()

router.use('/ws', require('./websocket'))

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router
