var colors = ['#e46767', '#6bb11c', '#4c6cdf']

var parse_card = function (value) {
  // Number: { One, Two, Three }
  // Shading: { Solid, Striped, Open }
  // Color: { Red, Green, Purple }
  // Shape: { Ovals, Squiggles, Diamonds }

  var shape = value % 10 + 0 * (value = Math.floor(value / 10)) - 1
  var color = value % 10 + 0 * (value = Math.floor(value / 10)) - 1
  var shading = value % 10 + 0 * (value = Math.floor(value / 10)) - 1
  var number = value % 10 + 0 * (value = Math.floor(value / 10))
  var _color = colors[color]
  return {
    number: number,
    shading: [_color, null, 'transparent'][shading],
    color: _color,
    shape: '/static/svg/' + ['oval', 'squiggle', 'diamond'][shape] + '.svg',
  }
}

Vue.component('card', {
  template: '#card-template',
  props: ['value'],
  data: function () {
    var data = parse_card(this.value)
    console.log(data)
    return data
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
  data: {},
  methods: {

  }
})
