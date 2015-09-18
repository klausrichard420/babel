import remapAsyncToGenerator from "../../helpers/remap-async-to-generator";

export { manipulateOptions } from "./bluebird-coroutines";

export let metadata = {
  optional: true,
  dependencies: ["es7.asyncFunctions", "es6.classes"]
};

export let visitor = {
  Function(node, parent, scope, file) {
    if (!node.async || node.generator) return;

    return remapAsyncToGenerator(this, file.addHelper("async-to-generator"));
  }
};
