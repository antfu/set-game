var colors = ['#e46767', '#6bb11c', '#4caadf']

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

function shuffle(array) {
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

function make_deck() {
  var deck = []
  for (var v1 = 1; v1 <= 3; v1++)
    for (var v2 = 1; v2 <= 3; v2++)
      for (var v3 = 1; v3 <= 3; v3++)
        for (var v4 = 1; v4 <= 3; v4++)
          deck.push(v1 * 1000 + v2 * 100 + v3 * 10 + v4)
  deck = shuffle(deck)
  return deck
}
