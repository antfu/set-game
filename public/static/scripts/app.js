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
    ground: []
  },
  methods: {
    select: function(e) {
      console.log(e)
    }
  }
})


var deck = make_deck()
app.ground = deck.slice(0,16)
