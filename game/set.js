var Player = require('./player')
var utils = require('../public/static/scripts/utils')


class SetGame {
  constructor(name) {
    this.name = name
    this.players = {}
  }

  start() {
    this.deck = utils.make_deck()
    this.amount = 12
    this.ground = this.deck.splice(0, this.amount)
    this.check_expend()
  }

  check_expend() {
    var sol = utils.has_set(this.ground)
    if (sol)
      return true

    if (this.amount >= 18 || this.deck.length <= 0) {
      this.gameover()
      return false
    }

    this.amount = this.amount + 3
    for (var i = 0; i < 3; i++)
      this.ground.push(this.deck.shift())
    return this.check_expend()
  }

  get_player(name) {
    return this.players[name] = this.players[name] || new Player(this, name)
  }

  gameover() {

  }

  boardcast(data) {

  }
}

module.exports = SetGame
