import * as strict from "../../helpers/strict";

export var metadata = {
  group: "builtin-modules"
};

export var Program = {
  exit(program, parent, scope, file) {
    strict.wrap(program, function () {
      program.body = file.dynamicImports.concat(program.body);
    });

    if (!file.transformers["es6.modules"].canTransform()) return;

    if (file.moduleFormatter.transform) {
      file.moduleFormatter.transform(program);
    }
  }
};
