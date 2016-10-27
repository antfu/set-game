var COLORS = ['#e46767', '#6bb11c', '#4caadf']

var separte_number = function (value) {
  var result = []
  while (value)
    result.unshift(value % 10 + 0 * (value = Math.floor(value / 10)))
  return result
}

var parse_card = function (value) {
  // Number: { One, Two, Three }
  // Shading: { Solid, Striped, Open }
  // Color: { Red, Green, Purple }
  // Shape: { Ovals, Squiggles, Diamonds }

  var data = separte_number(value)
  var _color = COLORS[data[2] - 1]
  return {
    number: data[0],
    shading: [_color, null, 'transparent'][data[1] - 1],
    color: _color,
    shape: '/static/svg/' + ['oval', 'squiggle', 'diamond'][data[3] - 1] + '.svg',
  }
}

var is_set = function (cards) {
  var numbers = []
  for (var i = 0; i < 3; i++)
    numbers[i] = separte_number(cards[i])

  for (var i = 0; i < 4; i++) {
    var all_same = numbers[0][i] === numbers[1][i] && numbers[1][i] === numbers[2][i]
    var all_diff = numbers[0][i] !== numbers[1][i] && numbers[1][i] !== numbers[2][i] && numbers[0][i] !== numbers[2][i]
    if (!(all_same || all_diff))
      return false
  }
  return true
}

var shuffle = function (array) {
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

var make_deck = function () {
  var deck = []
  for (var v1 = 1; v1 <= 3; v1++)
    for (var v2 = 1; v2 <= 3; v2++)
      for (var v3 = 1; v3 <= 3; v3++)
        for (var v4 = 1; v4 <= 3; v4++)
          deck.push(v1 * 1000 + v2 * 100 + v3 * 10 + v4)
  deck = shuffle(deck)
  return deck
}
