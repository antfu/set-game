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
    deck: []
  },
  methods: {
    select: function (index, e) {
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
      for (var i = 0; i < 3; i++)
        set[i] = this.ground[this.selected[i]]
      var judge = is_set(set)
      console.log(set, judge)
      if (judge) {
        // Success
        for (var i = 0; i < 3; i++)
          Vue.set(this.ground, this.selected[i], app.deck.shift())
        this.clear()
      } else {
        // Failed
        this.clear()
      }
    }
  }
})


app.deck = make_deck()
app.ground = app.deck.splice(0, 16)
