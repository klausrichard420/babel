var _bar = babelHelpers.classPrivateFieldLooseKey("bar");

var _ = babelHelpers.classPrivateFieldLooseKey("_");

var _2 = babelHelpers.classPrivateFieldLooseKey("_2");

class Foo {}

Object.defineProperty(Foo, _bar, {
  writable: true,
  value: 21
});
Object.defineProperty(Foo, _, {
  writable: true,
  value: (() => {
    Foo.foo = babelHelpers.classPrivateFieldLooseBase(Foo, _bar)[_bar];
    Foo.qux1 = Foo.qux;
  })()
});
Foo.qux = 21;
Object.defineProperty(Foo, _2, {
  writable: true,
  value: (() => {
    Foo.qux2 = Foo.qux;
  })()
});
