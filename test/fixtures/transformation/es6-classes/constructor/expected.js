"use strict";

var Test = (function () {
  function Test() {
    babelHelpers.classCallCheck(this, Test);

    this.state = "test";
  }

  return Test;
})();

var Foo = (function (_Bar) {
  function Foo() {
    babelHelpers.classCallCheck(this, Foo);

    babelHelpers.get(Object.getPrototypeOf(Foo.prototype), "constructor", this).call(this);
    this.state = "test";
  }

  babelHelpers.inherits(Foo, _Bar);
  return Foo;
})(Bar);