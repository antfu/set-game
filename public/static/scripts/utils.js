(function (exports) {
  exports.COLORS = ['#e46767', '#6bb11c', '#4caadf']

  exports.separte_number = function (value) {
    var result = []
    while (value)
      result.unshift(value % 10 + 0 * (value = Math.floor(value / 10)))
    return result
  }

  exports.parse_card = function (value) {
    // Number: { One, Two, Three }
    // Shading: { Solid, Striped, Open }
    // Color: { Red, Green, Purple }
    // Shape: { Ovals, Squiggles, Diamonds }

    var data = exports.separte_number(value)
    var _color = exports.COLORS[data[2] - 1]
    return {
      code: value,
      number: data[0],
      shading: [_color, null, 'transparent'][data[1] - 1],
      color: _color,
      shape: '/static/svg/' + ['oval', 'squiggle', 'diamond'][data[3] - 1] + '.svg',
    }
  }

  exports.repeat = function(v, n) {
    var result = []
    for (var i = 0; i < n; i++)
      result.push(v)
    return result
  }
  
  exports.range = function (start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
      foo.push(i);
    }
    return foo;
  }

  exports.is_set = function (cards) {
    var numbers = []
    for (var i = 0; i < 3; i++) {
      if (!cards[i])
        return false
      else
        numbers[i] = exports.separte_number(cards[i])
    }

    for (var i = 0; i < 4; i++) {
      var all_same = numbers[0][i] === numbers[1][i] && numbers[1][i] === numbers[2][i]
      var all_diff = numbers[0][i] !== numbers[1][i] && numbers[1][i] !== numbers[2][i] && numbers[0][i] !== numbers[2][i]
      if (!(all_same || all_diff))
        return false
    }
    return true
  }

  exports.has_set = function (ground) {
    var amount = ground.length
    for (var x = 0; x < amount - 2; x++)
      for (var y = x + 1; y < amount - 1; y++)
        for (var z = y + 1; z < amount; z++)
          if (exports.is_set([ground[x], ground[y], ground[z]]))
            return [x, y, z]
  }

  exports.shuffle = function (array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  exports.make_deck = function () {
    var deck = []
    for (var v1 = 1; v1 <= 3; v1++)
      for (var v2 = 1; v2 <= 3; v2++)
        for (var v3 = 1; v3 <= 3; v3++)
          for (var v4 = 1; v4 <= 3; v4++)
            deck.push(v1 * 1000 + v2 * 100 + v3 * 10 + v4)
    deck = exports.shuffle(deck)
    return deck
  }

  exports.inarr = function (value, array) {
    return array.indexOf(value) !== -1
  }

  exports.vibrate = function (time) {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate
    if (navigator.vibrate)
      navigator.vibrate(time || 500)
  }

  exports.fullscreen = function (el) {
    if (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    ) {
      if (el.requestFullscreen)
        el.requestFullscreen();
      else if (el.mozRequestFullScreen)
        el.mozRequestFullScreen()
      else if (el.webkitRequestFullScreen)
        el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      else
        return false
    } else
      return false
    return true
  }

  exports.fullscreen_exit = function () {
    if (document.exitFullscreen)
      document.exitFullscreen()
    else if (document.mozExitFullscreen)
      document.mozExitFullscreen()
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    return false
  }

})(typeof exports === 'undefined' ? this.utils = {} : exports);
