import * as t from "../../../types";

var functionChildrenVisitor = {
  enter(node, parent, scope, state) {
    if (this.isClass(node)) {
      return this.skip();
    }

    if (this.isFunction() && !node.shadow) {
      return this.skip();
    }

    if (node._shadowedFunctionLiteral) return this.skip();

    var getId;

    if (this.isIdentifier() && node.name === "arguments") {
      getId = state.getArgumentsId;
    } else if (this.isThisExpression()) {
      getId = state.getThisId;
    } else {
      return;
    }

    if (this.isReferenced()) return getId();
  }
};

var functionVisitor = {
  enter(node, parent, scope, state) {
   if (!node.shadow) {
      if (this.isFunction()) {
        // stop traversal of this node as it'll be hit again by this transformer
        return this.skip();
      } else {
        return;
      }
    }

    // traverse all child nodes of this function and find `arguments` and `this`
    this.traverse(functionChildrenVisitor, state);

    node.shadow = false;

    return this.skip();
  }
};

function aliasFunction(getBody, path, scope) {
  var argumentsId;
  var thisId;

  var state = {
    getArgumentsId() {
      return argumentsId = argumentsId || scope.generateUidIdentifier("arguments");
    },

    getThisId() {
      return thisId = thisId || scope.generateUidIdentifier("this");
    }
  };

  // traverse the function and find all alias functions so we can alias
  // `arguments` and `this` if necessary
  path.traverse(functionVisitor, state);

  var body;

  var pushDeclaration = function (id, init) {
    body = body || getBody();
    body.unshift(t.variableDeclaration("var", [
      t.variableDeclarator(id, init)
    ]));
  };

  if (argumentsId) {
    pushDeclaration(argumentsId, t.identifier("arguments"));
  }

  if (thisId) {
    pushDeclaration(thisId, t.thisExpression());
  }
};

// todo: on all `this` and `arguments`, walk UP the tree instead of
// crawling the entire function tree

export var metadata = {
  group: "builtin-trailing"
};

export var Program = {
  exit(node, parent, scope) {
    aliasFunction(function () {
      return node.body;
    }, this, scope);
  }
};

export var FunctionDeclaration = {
  exit(node, parent, scope) {
    aliasFunction(function () {
      t.ensureBlock(node);
      return node.body.body;
    }, this, scope);
  }
};

export { FunctionDeclaration as FunctionExpression };
