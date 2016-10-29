class Player {
  constructor(game, name) {
    this.game = game
    this.name = name
  }

  bind_ws(ws) {
    this.ws = ws
  }

  is_avaliable() {
    return this.ws !== undefined
  }

  send(data) {
    if (this.is_avaliable()) {
      this.ws.send(JSON.stringify(data))
    }
  }
}


module.exports = Player
