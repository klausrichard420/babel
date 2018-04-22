"use strict";

let Hello =
/*#__PURE__*/
function () {
  function Hello() {
    babelHelpers.classCallCheck(this, Hello);
  }

  babelHelpers.createClass(Hello, [{
    key: "toString",
    value: function toString() {
      return 'hello';
    }
  }]);
  return Hello;
}();

let Outer =
/*#__PURE__*/
function (_Hello) {
  function Outer() {
    var _this;

    babelHelpers.classCallCheck(this, Outer);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Outer).call(this));

    var _babelHelpers$get$cal = babelHelpers.get(babelHelpers.getPrototypeOf(Outer.prototype), "toString", babelHelpers.assertThisInitialized(_this)).call(babelHelpers.assertThisInitialized(_this));

    let Inner = function Inner() {
      babelHelpers.classCallCheck(this, Inner);
      babelHelpers.defineProperty(this, _babelHelpers$get$cal, 'hello');
    };

    return babelHelpers.possibleConstructorReturn(_this, new Inner());
  }

  babelHelpers.inherits(Outer, _Hello);
  return Outer;
}(Hello);

expect(new Outer().hello).toBe('hello');
