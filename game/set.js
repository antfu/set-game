var Player = require('./player')
var utils = require('../public/static/scripts/utils')

class SetGame {
  constructor(name) {
    this.name = name
    this.players = {}
    this.start()
  }

  start() {
    this.deck = utils.make_deck()
    this.amount = 12
    this.ground = this.deck.splice(0, this.amount)
    this.previous = { cards: [], name: '' }
    this.solved = {}
    this.check_expend()
    this.boardcast(this.all())
    this.starttime = (new Date()).getTime()
  }

  player_amount() {
    return Object.keys(this.players).length
  }
  all() {
    return {
      update: this.info(),
      ground: this.ground,
      players: this.player_amount()
    }
  }

  info() {
    return {
      amount: this.amount,
      previous: this.previous,
      deck_amount: this.deck.length
    }
  }

  check_expend() {
    var sol = utils.has_set(this.ground)
    if (sol)
      return true

    if (this.amount >= 18 || this.deck.length <= 0) {
      this.gameover()
      return false
    }

    console.log('EXPENEDING')
    this.amount += 3
    var appends = []
    for (var i = 0; i < 3; i++) {
      var new_card = this.deck.shift()
      this.ground.push(new_card)
      appends.push(new_card)
    }
    this.boardcast({ expend: appends })
    return this.check_expend()
  }

  get_player(name) {
    return this.players[name] = this.players[name] || new Player(this, name)
  }

  gameover() {
    this.endtime = (new Date()).getTime()
    this.boardcast({
      gameover: {
        scoreboard: this.solved,
        timespan: this.endtime - this.starttime
      }
    })
    this.start()
  }

  leave(player) {
    delete this.players[player.name]
    this.boardcast({ players: this.player_amount() })
  }

  set(indexes, player) {
    var cards = []
    for (var i = 0; i < indexes.length; i++)
      cards.push(this.ground[indexes[i]])
    if (utils.is_set(cards)) {
      var new_cards = utils.repeat(3, () => { return this.deck.pop() })
      for (var i = 0; i < indexes.length; i++)
        this.ground[indexes[i]] = new_cards[i]

      if (this.solved[player.name] === undefined)
        this.solved[player.name] = 0
      this.solved[player.name] += 1

      this.previous = {
        cards: cards,
        name: player.name
      }

      this.boardcast({
        set_made: {
          indexes: indexes,
          new_cards: new_cards
        },
        update: this.info()
      })

      player.send({ solved: this.solved[player.name] })

      this.check_expend()

    } else {
      //TODO:
      player.send({ set_failed: true })
    }
  }

  boardcast(data) {
    for (var name in this.players)
      this.players[name].send(data)
  }
}

module.exports = SetGame
