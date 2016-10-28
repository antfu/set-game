class Player {
  constructor(game, name) {
    this.game = game
    this.name = name
  }

  get ws() {
    return this.ws
  }
  set ws(ws) {
    this.ws = ws
  }

  get avaliable() {
    return this.ws !== undefined
  }

  send(data) {
    if (this.avaliable) {
      this.ws.send(JSON.stringify(data))
    }
  }

}
