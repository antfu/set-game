Vue.component('card', {
  template: '#card-template',
  props: ['value'],
  data: function () {
    return {}
  },
  computed: {
    com: function () {
      return parse_card(this.value)
    }
  }
})

Vue.directive('svg', {
  bind: function (el, binding) {
    this.refresh = function (_binding) {
      var value = _binding.value || {}

      while (el.firstChild)
        el.removeChild(el.firstChild);

      var img = document.createElement('img')
      img.src = _binding.value.shape
      el.appendChild(img)
      SVGInjector(img, {
        each: function (svg) {
          svg.style.stroke = value.color || '#444'
          svg.style.fill = value.shading || ('url(#' + svg.getElementsByTagName("pattern")[0].id + ')')
        }
      })
    }
    this.refresh(binding)
  },
  update: function (el, binding) {
    this.refresh(binding)
  }
})

var app = new Vue({
  el: '#app',
  data: {
    ground: [],
    selected: [],
    deck: [],
    flipped: [],
    previous: [],
    amount: 12,
    solved: 0,
    fullscreened: false
  },
  computed: {
    deck_amount: function () {
      return this.deck.length
    }
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
    set: function () {
      if (this.selected.length !== 3)
        return
      var set = []
      var vm = this
      for (var i = 0; i < 3; i++)
        set[i] = this.ground[this.selected[i]]
      var judge = is_set(set)
      console.log(set, judge)
        //judge = true //for debug
      if (judge) {
        vibrate(100)
        this.solved = this.solved + 1
        var selected = this.selected.slice(0)
        this.previous = set
        this.flips({
          cards: selected,
          to: 0,
          callback: function () {
            setTimeout(function () {
              for (var i = 0; i < 3; i++)
                Vue.set(vm.ground, selected[i], app.deck.shift())
              vm.flips({
                cards: selected,
                delay: 200
              })
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
  }
})
