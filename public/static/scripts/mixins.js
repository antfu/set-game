var Mixins = Mixins || {}

Mixins.commons = {
  data: {
    ground: [],
    selected: [],
    flipped: utils.repeat(18, 0),
    fullscreened: false,
    debug: false,
    amount: 12,
    solved: 0,
    local: false,
    helping: false,
    is_gameover: false,
    is_menu: false,
    scoreboard: {},
    previous: {
      name: '',
      cards: []
    },
  },
  methods: {
    get_selected: function (s) {
      var selected = s || this.selected
      var set = []
      for (var i = 0; i < selected.length; i++)
        set[i] = this.ground[selected[i]]
      return set
    },
    select: function (index, e) {
      if (!this.flipped[index])
        return;
      if (this.inarr(index, this.selected))
        this.selected.splice(this.selected.indexOf(index), 1);
      else
      if (this.selected.length < 3)
        this.selected.push(index)
    },
    inarr: function (value, array) {
      return array.indexOf(value) !== -1
    },
    clear: function () {
      this.selected = []
    },
    flips: function (obj) {
      var vm = this
      setTimeout(function () {
        vm.flip(obj.cards.slice(0), obj.to, obj.timeout, obj.inorder, obj.callback)
      }, obj.delay || 0)
    },
    flip: function (cards, to, timeout, inorder, callback) {
      var vm = this
      var i = inorder ? 0 : Math.floor(Math.random() * cards.length)
      to = to === undefined ? 1 : to
      var t_timeout = timeout || 130

      if (this.flipped[cards[i]] === to)
        t_timeout = 0
      else
        Vue.set(this.flipped, cards[i], to)

      cards.splice(i, 1)
      if (cards.length)
        setTimeout(function () {
          vm.flip(cards, to, timeout, inorder, callback)
        }, t_timeout)
      else
      if (callback)
        callback()
    },
    fullscreen: function () {
      if (this.fullscreened)
        this.fullscreened = utils.fullscreen_exit()
      else
        this.fullscreened = utils.fullscreen(document.body)
    },
    has_set: function () {
      return utils.has_set(this.ground)
    },
    cheat: function () {
      this.selected = this.has_set()
    },
    auto: function () {
      var sol = this.has_set()
      if (sol)
        this.set(sol)
    },
    help: function () {
      //location.href = "/help?from=" + location.pathname
      this.helping = !this.helping
    },
    menu: function (open) {
      this.is_menu = open
    },
    gameover: function (obj) {
      if (!obj) {
        this.is_gameover = false
      } else {
        this.scoreboard = obj
        this.is_gameover = true
      }
    },
    set_made: function (indexes, new_cards, callback) {
      var vm = this
      utils.vibrate(100)
      this.flips({
        cards: indexes,
        to: 0,
        callback: function () {
          setTimeout(function () {
            for (var i = 0; i < indexes.length; i++)
              if (indexes[i] !== undefined)
                Vue.set(vm.ground, indexes[i], new_cards[i])
            vm.flips({ cards: indexes, delay: 200 })
            if (callback)
              callback()
          }, 500)
        },
      })
      vm.clear()
    },
    set_failed: function () {
      utils.vibrate(500)
      this.clear()
    }
  }
}

Mixins.local = {
  data: {
    deck: [],
    hints: 2,
    local: true,
  },
  computed: {
    deck_amount: function () {
      return this.deck.length
    }
  },
  methods: {
    set: function (s) {
      var vm = this
      var selected = (s || this.selected).slice(0)
      if (selected.length !== 3)
        return
      var set = this.get_selected(selected)
      if (utils.is_set(set)) {
        this.solved = this.solved + 1
        this.previous.cards = set.sort()
        this.previous.name = 'Previous'
        var new_cards = utils.repeat(3, function () { return vm.deck.pop() })
        this.set_made(selected, new_cards, function () {
          vm.expend()
          vm.save()
        })
      } else {
        vm.set_failed()
      }
    },
    expend: function () {
      var sol = this.has_set()
      console.log(sol)
      if (sol)
        return true

      if (this.amount >= 18 || this.deck_amount <= 0) {
        this.gameover({})
        this.restart()
        return false
      }

      this.amount = this.amount + 3
      for (var i = 0; i < 3; i++)
        this.ground.push(this.deck.shift())

      this.flips({
        cards: utils.range(this.amount - 3, this.amount - 1),
        timeout: 70,
        delay: 500
      })
      return this.expend()
    },
    restart: function () {
      localStorage.removeItem('set-game-save')
      this.amount = 12
      this.flipped = utils.repeat(18, 0)

      this.previous = {
        name: '',
        cards: []
      }
      this.hints = 2
      this.deck = utils.make_deck()
      this.ground = this.deck.splice(0, this.amount)
      this.solved = 0
      this.flips({
        cards: utils.range(0, this.amount - 1),
        timeout: 70,
        delay: 500
      })

      this.expend()
    },
    save: function () {
      var data = {
        deck: this.deck,
        ground: this.ground,
        amount: this.amount,
        solved: this.solved,
        hints: this.hints,
        previous: this.previous,
        time: (new Date()).getTime()
      }
      localStorage.setItem('set-game-save', JSON.stringify(data))
      return data
    },
    load: function () {
      var saved = localStorage.getItem('set-game-save')
      if (!saved)
        return null
      var data = JSON.parse(saved)

      this.flipped = utils.repeat(18, 0)

      for (var k in data)
        Vue.set(this, k, data[k])

      this.flips({
        cards: utils.range(0, this.amount - 1),
        timeout: 70,
        delay: 500
      })
      this.expend()
      return true
    },
    hint: function () {
      if (this.hints) {
        this.cheat()
        this.hints--
      }
    }
  },
  created: function () {
    if (!this.load())
      this.restart()
  }
}

Mixins.web = function (url) {
  var cache = {}

  return {
    data: {
      url: url,
      deck_amount: 0,
      connected: false,
      local: false
    },
    methods: {
      set: function (s) {
        var selected = (s || this.selected).slice(0)
        if (selected.length !== 3)
          return
        this.send({ play: selected })
      },
      send: function (obj) {
        this.socket.send(JSON.stringify(obj))
      },
      restart: function () {
        this.send({ restart: true })
      },
      connect: function () {
        var vm = this
        if (this.socket && this.socket.readyState !== this.socket.CLOSED)
          return
        this.socket = new WebSocket(this.url)
        this.socket.onmessage = function (e) {
          var msg = JSON.parse(e.data)
          console.log('Message: ', msg)
          if (msg.update) {
            for (var k in msg.update)
              Vue.set(vm, k, msg.update[k])
          }
          if (msg.ground)
            vm.flips({
              to: 0,
              cards: utils.range(0, msg.ground.length - 1),
              timeout: 70,
              callback: function () {
                vm.ground = msg.ground
                vm.flips({ cards: utils.range(0, msg.ground.length - 1), timeout: 70, delay: 300 })
              }
            })
          if (msg.set_made)
            vm.set_made(msg.set_made.indexes, msg.set_made.new_cards)
          if (msg.set_failed)
            vm.set_failed()
          if (msg.solved)
            vm.solved = msg.solved
          if (msg.expend) {
            var count = msg.expend.length
            var start = vm.ground.length
            while (msg.expend.length)
              vm.ground.push(msg.expend.shift())
            vm.flips({
              cards: utils.range(start, start + count - 1),
              timeout: 70
            })
          }
          if (msg.gameover)
            vm.gameover(msg.gameover)
        }
        this.socket.onclose = function (e) {
          vm.connected = false
        }
        this.socket.onopen = function () {
          vm.connected = true
        }
        return this.socket
      }
    },
    created: function () {
      this.connect()
    }
  }
}
