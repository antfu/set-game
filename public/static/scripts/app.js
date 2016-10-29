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
