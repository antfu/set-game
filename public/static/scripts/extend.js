Vue.component('card', {
  template: '#card-template',
  props: ['value'],
  data: function () {
    return {}
  },
  computed: {
    com: function () {
      if (this.value)
        return utils.parse_card(this.value)
      else
        return null
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
          if (svg && svg.style) {
            svg.style.stroke = value.color || '#444'
            svg.style.fill = value.shading || ('url(#' + svg.getElementsByTagName("pattern")[0].id + ')')
          }
        }
      })
    }
    this.refresh(binding)
  },
  update: function (el, binding) {
    this.refresh(binding)
  }
})
