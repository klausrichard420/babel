"use strict";

var arr = (function () {
  var _arr = [];

  for (var _iterator = nums[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    var i = _step.value;

    if (i > 1) {
      _arr.push(i * i);
    }
  }

  return _arr;
})();
