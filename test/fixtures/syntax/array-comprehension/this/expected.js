function add() {
  var _this = this;
  return [1, 2, 3].map(function () {
    return i * _this.multiplier;
  });
}

add.call({ multiplier: 5 });
