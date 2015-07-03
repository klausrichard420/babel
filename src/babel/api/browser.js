/* eslint no-new-func: 0 */

require("./node");
var transform = module.exports = require("../transformation");

/**
 * [Please add a description.]
 */

transform.options = require("../transformation/file/options");
transform.version = require("../../../package").version;

transform.transform = transform;

/**
 * [Please add a description.]
 */

transform.run = function (code, opts = {}) {
  opts.sourceMaps = "inline";
  return new Function(transform(code, opts).code)();
};

/**
 * [Please add a description.]
 */

transform.load = function (url, callback, opts = {}, hold) {
  opts.filename = opts.filename || url;

  var xhr = global.ActiveXObject ? new global.ActiveXObject("Microsoft.XMLHTTP") : new global.XMLHttpRequest();
  xhr.open("GET", url, true);
  if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain");

  /**
   * [Please add a description.]
   */

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;

    var status = xhr.status;
    if (status === 0 || status === 200) {
      var param = [xhr.responseText, opts];
      if (!hold) transform.run.apply(transform, param);
      if (callback) callback(param);
    } else {
      throw new Error(`Could not load ${url}`);
    }
  };

  xhr.send(null);
};

/**
 * [Please add a description.]
 */

var runScripts = function () {
  var scripts = [];
  var types   = ["text/ecmascript-6", "text/6to5", "text/babel", "module"];
  var index   = 0;

  /**
   * [Please add a description.]
   */

  var exec = function () {
    var param = scripts[index];
    if (param instanceof Array) {
      transform.run.apply(transform, param);
      index++;
      exec();
    }
  };

  /**
   * [Please add a description.]
   */

  var run = function (script, i) {
    var opts = {};

    if (script.src) {
      transform.load(script.src, function (param) {
        scripts[i] = param;
        exec();
      }, opts, true);
    } else {
      opts.filename = "embedded";
      scripts[i] = [script.innerHTML, opts];
    }
  };

  var _scripts = global.document .getElementsByTagName("script");

  for (var i = 0; i < _scripts.length; ++i) {
    var _script = _scripts[i];
    if (types.indexOf(_script.type) >= 0) scripts.push(_script);
  }

  for (i in scripts) {
    run(scripts[i], i);
  }

  exec();
};

/**
 * [Please add a description.]
 */

if (global.addEventListener) {
  global.addEventListener("DOMContentLoaded", runScripts, false);
} else if (global.attachEvent) {
  global.attachEvent("onload", runScripts);
}
