"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _regeneratorRuntime = require("6to5-runtime/regenerator");

var _core = require("6to5-runtime/core-js");

var giveWord = _regeneratorRuntime.mark(function giveWord() {
  return _regeneratorRuntime.wrap(function giveWord$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return myWord;
      case 2:
      case "end":
        return context$1$0.stop();
    }
  }, giveWord, this);
});

exports.giveWord = giveWord;
var foo = _to5Helpers.interopRequire(require("someModule"));

var bar = _to5Helpers.interopRequireWildcard(require("someModule"));

var myWord = exports.myWord = _core.Symbol("abc");
