var Mixins = Mixins || {}

Mixins.commons = {
  data: {
    flipped: [],
    fullscreened: false,
    debug: false,
  },
  methods: {
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
      Vue.set(this.flipped, cards[i], to === undefined ? 1 : to)
      cards.splice(i, 1)
      if (cards.length)
        setTimeout(function () {
          vm.flip(cards, to, timeout, inorder, callback)
        }, timeout || 130)
      else
      if (callback)
        callback()
    },
    fullscreen: function () {
      if (this.fullscreened)
        this.fullscreened = fullscreen_exit()
      else
        this.fullscreened = fullscreen(document.body)
    },
    has_set: function () {
      var amount = this.ground.length;
      for (var x = 0; x < amount - 2; x++)
        for (var y = x + 1; y < amount - 1; y++)
          for (var z = y + 1; z < amount; z++)
            if (is_set([this.ground[x], this.ground[y], this.ground[z]]))
              return [x, y, z]
      return false
    }
  }
}

Mixins.local = {
  data: {
    ground: [],
    selected: [],
    deck: [],
    previous: {
      name: '',
      cards: []
    },
    amount: 12,
    solved: 0
  },
  computed: {
    deck_amount: function () {
      return this.deck.length
    }
  },
  methods: {
    set: function (s) {
      var selected = (s || this.selected).slice(0)
      if (selected.length !== 3)
        return
      var set = []
      var vm = this
      for (var i = 0; i < 3; i++)
        set[i] = this.ground[selected[i]]
      var judge = is_set(set)
      console.log(set, judge)
      if (this.debug)
        judge = true //for debug
      if (judge) {
        vibrate(100)
        this.solved = this.solved + 1
        this.previous.cards = set.sort()
        this.previous.name = 'Previous'
        this.flips({
          cards: selected,
          to: 0,
          callback: function () {
            setTimeout(function () {
              for (var i = 0; i < 3; i++)
                if (selected[i] !== undefined)
                  Vue.set(vm.ground, selected[i], app.deck.shift())
              vm.flips({
                cards: selected,
                delay: 200
              })
              vm.expend()
            }, 500)
          },
        })
        vm.clear()
      } else {
        // Failed
        vibrate(500)
        this.clear()
      }
    },
    expend: function () {
      var sol = this.has_set()
      console.log(sol)
      if (sol)
        return true

      if (this.amount >= 18 || this.deck_amount <= 0) {
        this.gameover()
        location.reload()
        return false
      }

      this.amount = this.amount + 3
      for (var i = 0; i < 3; i++) {
        this.flipped.push(0)
        this.ground.push(this.deck.shift())
      }
      this.flips({
        cards: range(this.amount - 3, this.amount - 1),
        timeout: 70,
        delay: 500
      })
      return this.expend()
    },
    gameover: function () {
      alert('Gameover! ' + this.solved + ' Sets found!')
    },
    auto: function () {
      var sol = this.has_set()
      if (sol)
        this.set(sol)
    }
  },
  created: function () {
    this.flipped = []
    for (var i = 0; i < this.amount; i++)
      this.flipped.push(0)

    this.deck = make_deck()
    this.ground = this.deck.splice(0, this.amount)
    this.flips({
      cards: range(0, this.amount - 1),
      timeout: 70,
      delay: 500
    })

    this.expend()
  }
}

Mixins.web = function (url) {
  var cache = {}

  return {
    methods: {
      set: {

      }
    },
    created: function () {
      //TODO
    }
  }
}
