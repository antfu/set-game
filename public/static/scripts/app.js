Vue.component('card', {
  template: '#card-template',
  props: ['value'],
  data: function () {
    return parse_card(this.value)
  }
})

Vue.directive('svg', function (el, binding) {
  SVGInjector(el, {
    each: function (svg) {
      var value = binding.value || {}
      svg.style.stroke = value.color || '#444'
      svg.style.fill = value.shading || ('url(#' + svg.getElementsByTagName("pattern")[0].id + ')')
    }
  })
})

var app = new Vue({
  el: '#app',
  data: {
    ground: [],
    selected: []
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
    }
  }
})


var deck = make_deck()
app.ground = deck.slice(0, 16)
