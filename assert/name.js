var fs = require('fs')

var names = []
var count = 0

fs.readFile('./assert/names.txt', 'utf8', function (err, data) {
  if (err)
    return console.log(err)

  names = data.trim().split('\n')
  count = names.length
})

module.exports.names = names
module.exports.randname = () => {
  return names[Math.floor(Math.random() * count)]
}
