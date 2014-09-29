var transform = require("../lib/6to5/transform");
var assert    = require("assert");
var fs        = require("fs");
var _         = require("lodash");

var humanise = function (val) {
  return val.replace(/-/g, " ");
};

var readFile = function (filename) {
  if (fs.existsSync(filename)) {
    return fs.readFileSync(filename);
  } else {
    return "";
  }
};

var fixturesDir = __dirname + "/fixtures";

_.each(fs.readdirSync(fixturesDir), function (suiteName) {
  var suiteDir = fixturesDir + "/" + suiteName;

  var suiteOptsLoc = suiteDir + "/options.json";
  var suiteOpts = {};
  if (fs.existsSync(suiteOptsLoc)) suiteOpts = require(suiteOptsLoc);

  suite(humanise(suiteName), function () {
    _.each(fs.readdirSync(suiteDir), function (taskName) {
      var taskDir = suiteDir + "/" + taskName;
      if (fs.statSync(taskDir).isFile()) return;

      test(humanise(taskName), function () {
        var actualLoc = taskDir + "/actual.js";

        var actual = readFile(actualLoc);
        var expect = readFile(taskDir + "/expected.js");

        var taskOptsLoc = taskDir + "/options.json";
        var taskOpts = _.merge({ filename: actualLoc }, _.cloneDeep(suiteOpts));
        if (fs.existsSync(taskOptsLoc)) _.merge(taskOpts, require(taskOptsLoc));

        var test = function () {
          transform.test(actual, expect, taskOpts);
        };

        var throwMsg = taskOpts.throws;
        if (throwMsg) {
          // internal api doesn't have this option but it's best not to pollute
          // the options object with useless options
          delete taskOpts.throws;
          assert.throws(test, new RegExp(throwMsg));
        } else {
          test();
        }
      });
    });
  });
});
