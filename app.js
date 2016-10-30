var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var expressWs = require('express-ws')(app)
var port = process.env.PORT || 3000

app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
if (process.env.DEBUG)
  app.disable('view cache')

app.use(require('less-middleware')(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('./controllers'))

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).redirect('/')
});

app.listen(port, function () {
  console.log('Listening on port ' + port)
})
