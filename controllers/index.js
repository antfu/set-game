var express = require('express')
var router = express.Router()
var randname = require('../assert/name.js').randname

router.use('/ws', require('./websocket'))

router.get('/', function (req, res) {
  res.render('home')
})

router.get('/r', function (req, res) {
  res.redirect('/r/default')
})

router.get('/help', function (req, res) {
  res.render('help')
})

router.get('/s', function (req, res) {
  res.render('solo')
})

router.get('/r/:room', function (req, res) {
  res.redirect('/r/' + req.params.room + '/p/' + randname().toLowerCase())
})

router.get('/r/:room/p/:player', function (req, res) {
  res.render('multi')
})

// 404
router.get('*', function (req, res) {
  res.status(404).render('error', { error: 'PAGE NOT FOUND' })
})

module.exports = router
