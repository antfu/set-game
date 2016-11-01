
console.info('Hi. The source code is available on github: https://github.com/antfu/set-game.\nIf you have any questions, feel free to email me at anthonyfu117@hotmail.com.')

function makeapp(data) {
  var mixins = [Mixins.commons]
  if (data.mode === 'local')
    mixins.push(Mixins.local)
  if (data.mode === 'web') {
    var url = location.protocol.replace('http', 'ws') + '//' + location.host + '/ws' + location.pathname
    mixins.push(Mixins.web(url))
  }

  window.app = new Vue({
    el: '#app',
    mixins: mixins
  })
}
