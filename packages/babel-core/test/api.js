require("../lib/api/node");

var buildExternalHelpers = require("../lib/tools/build-external-helpers");
var transform            = require("../lib/transformation");
var Pipeline             = require("../lib/transformation/pipeline");
var assert               = require("assert");
var File                 = require("../lib/transformation/file").default;

function assertIgnored(result) {
  assert.ok(result.ignored);
}

function assertNotIgnored(result) {
  assert.ok(!result.ignored);
}

// shim
function transformAsync(code, opts) {
  return {
    then: function (resolve) {
      resolve(transform(code, opts));
    }
  };
}

suite("api", function () {
  test("code option false", function () {
    return transformAsync("foo('bar');", { code: false }).then(function (result) {
      assert.ok(!result.code);
    });
  });

  test("ast option false", function () {
    return transformAsync("foo('bar');", { ast: false }).then(function (result) {
      assert.ok(!result.ast);
    });
  });

  test("auxiliaryComment option", function () {
    return transformAsync("class Foo {}", {
      auxiliaryComment: "yo bro",
      plugins: [function (babel) {
        var t = babel.types;
        return {
          visitor: {
            Program: function (path) {
              path.unshiftContainer("body", t.expressionStatement(t.identifier("start")));
              path.pushContainer("body", t.expressionStatement(t.identifier("end")));
            }
          }
        };
      }]
    }).then(function (result) {
      assert.equal(result.code, "/*yo bro*/start;\nclass Foo {}\n/*yo bro*/end;");
    });
  });

  test("modules metadata", function () {
    return Promise.all([
      transformAsync('import { externalName as localName } from "external";').then(function (result) {
        assert.deepEqual(result.metadata.modules.imports[0], {
          source: "external",
          imported: ["externalName"],
          specifiers: [{
            kind: "named",
            imported: "externalName",
            local: "localName"
          }]
        });
      }),

      transformAsync('import * as localName2 from "external";').then(function (result) {
        assert.deepEqual(result.metadata.modules.imports[0], {
          source: "external",
          imported: ["*"],
          specifiers: [{
            kind: "namespace",
            local: "localName2"
          }]
        });
      }),

      transformAsync('import localName3 from "external";').then(function (result) {
        assert.deepEqual(result.metadata.modules.imports[0], {
          source: "external",
          imported: ["default"],
          specifiers: [{
            kind: "named",
            imported: "default",
            local: "localName3"
          }]
        });
      }),

      transformAsync('import localName from "./array";', {
        resolveModuleSource: function() {
          return "override-source";
        }
      }).then(function (result) {
        assert.deepEqual(result.metadata.modules.imports, [
          {
            source: "override-source",
            imported: ["default"],
            specifiers: [
              {
                "kind": "named",
                "imported": "default",
                "local": "localName"
              }
            ]
          }
        ]);
      }),

      transformAsync('export * as externalName1 from "external";', {
        plugins: [require("../../babel-plugin-syntax-export-extensions")]
      }).then(function (result) {
         assert.deepEqual(result.metadata.modules.exports, {
          exported: ['externalName1'],
          specifiers: [{
            kind: "external-namespace",
            exported: "externalName1",
            source: "external",
          }]
        });
      }),

      transformAsync('export externalName2 from "external";', {
        plugins: [require("../../babel-plugin-syntax-export-extensions")]
      }).then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: ["externalName2"],
          specifiers: [{
            kind: "external",
            local: "externalName2",
            exported: "externalName2",
            source: "external"
          }]
        });
      }),

      transformAsync('export function namedFunction() {}').then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: ["namedFunction"],
          specifiers: [{
            kind: "local",
            local: "namedFunction",
            exported: "namedFunction"
          }]
        });
      }),

      transformAsync('export var foo = "bar";').then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          "exported": ["foo"],
          specifiers: [{
            kind: "local",
            local: "foo",
            exported: "foo"
          }]
        });
      }),

      transformAsync("export { localName as externalName3 };").then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: ["externalName3"],
          specifiers: [{
            kind: "local",
            local: "localName",
            exported: "externalName3"
          }]
        });
      }),

      transformAsync('export { externalName4 } from "external";').then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: ["externalName4"],
          specifiers: [{
            kind: "external",
            local: "externalName4",
            exported: "externalName4",
            source: "external"
          }]
        });
      }),

      transformAsync('export * from "external";').then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: [],
          specifiers: [{
            kind: "external-all",
            source: "external"
          }]
        });
      }),

      transformAsync("export default function defaultFunction() {}").then(function (result) {
        assert.deepEqual(result.metadata.modules.exports, {
          exported: ["defaultFunction"],
          specifiers: [{
            kind: "local",
            local: "defaultFunction",
            exported: "default"
          }]
        });
      })
    ]);
  });

  test("ignore option", function () {
    return Promise.all([
      transformAsync("", {
        ignore: "node_modules",
        filename: "/foo/node_modules/bar"
      }).then(assertIgnored),

      transformAsync("", {
        ignore: "foo/node_modules",
        filename: "/foo/node_modules/bar"
      }).then(assertIgnored),

      transformAsync("", {
        ignore: "foo/node_modules/*.bar",
        filename: "/foo/node_modules/foo.bar"
      }).then(assertIgnored)
    ]);
  });

  test("only option", function () {
    return Promise.all([
      transformAsync("", {
        only: "node_modules",
        filename: "/foo/node_modules/bar"
      }).then(assertNotIgnored),

      transformAsync("", {
        only: "foo/node_modules",
        filename: "/foo/node_modules/bar"
      }).then(assertNotIgnored),

      transformAsync("", {
        only: "foo/node_modules/*.bar",
        filename: "/foo/node_modules/foo.bar"
      }).then(assertNotIgnored),

      transformAsync("", {
        only: "node_modules",
        filename: "/foo/node_module/bar"
      }).then(assertIgnored),

      transformAsync("", {
        only: "foo/node_modules",
        filename: "/bar/node_modules/foo"
      }).then(assertIgnored),

      transformAsync("", {
        only: "foo/node_modules/*.bar",
        filename: "/foo/node_modules/bar.foo"
      }).then(assertIgnored)
    ])
  });

  suite("env option", function () {
    var oldBabelEnv = process.env.BABEL_ENV;
    var oldNodeEnv = process.env.NODE_ENV;

    before(function () {
      delete process.env.BABEL_ENV;
      delete process.env.NODE_ENV;
    });

    after(function () {
      process.env.BABEL_ENV = oldBabelEnv;
      process.env.NODE_ENV = oldNodeEnv;
    });

    test("default", function () {
      return transformAsync("foo;", {
        env: {
          development: { code: false }
        }
      }).then(function (result) {
        assert.equal(result.code, undefined);
      });
    });

    test("BABEL_ENV", function () {
      process.env.BABEL_ENV = "foo";
      return transformAsync("foo;", {
        env: {
          foo: { code: false }
        }
      }).then(function (result) {
        assert.equal(result.code, undefined);
      });
    });

    test("NODE_ENV", function () {
      process.env.NODE_ENV = "foo";
      return transformAsync("foo;", {
        env: {
          foo: { code: false }
        }
      }).then(function (result) {
        assert.equal(result.code, undefined);
      });
    });
  });

  test("resolveModuleSource option", function () {
    var actual = 'import foo from "foo-import-default";\nimport "foo-import-bare";\nexport { foo } from "foo-export-named";';
    var expected = 'import foo from "resolved/foo-import-default";\nimport "resolved/foo-import-bare";\nexport { foo } from "resolved/foo-export-named";';

    return transformAsync(actual, {
      resolveModuleSource: function (originalSource) {
        return "resolved/" + originalSource;
      }
    }).then(function (result) {
      assert.equal(result.code.trim(), expected);
    });
  });

  suite("buildExternalHelpers", function () {
    test("all", function () {
      var script = buildExternalHelpers();
      assert.ok(script.indexOf("classCallCheck") >= -1);
      assert.ok(script.indexOf("inherits") >= 0);
    });

    test("whitelist", function () {
      var script = buildExternalHelpers(["inherits"]);
      assert.ok(script.indexOf("classCallCheck") === -1);
      assert.ok(script.indexOf("inherits") >= 0);
    });

    test("empty whitelist", function () {
      var script = buildExternalHelpers([]);
      assert.ok(script.indexOf("classCallCheck") === -1);
      assert.ok(script.indexOf("inherits") === -1);
    });
  });
});
