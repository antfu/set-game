var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , port = process.env.PORT || 3000


app.set('views', __dirname + '/views')
app.engine('pug', require('pug').__express)
app.disable('view cache');
app.set('view engine', 'pug')

app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(require('./controllers'))

app.listen(port, function() {
  console.log('Listening on port ' + port)
})
