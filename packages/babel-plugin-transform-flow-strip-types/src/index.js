import syntaxFlow from "babel-plugin-syntax-flow";

export default function({ types: t }) {
  const FLOW_DIRECTIVE = "@flow";

  let skipStrip = false;

  return {
    inherits: syntaxFlow,

    visitor: {
      Program(path, { file: { ast: { comments } }, opts }) {
        skipStrip = false;
        let directiveFound = false;

        for (const comment of (comments: Array<Object>)) {
          if (comment.value.indexOf(FLOW_DIRECTIVE) >= 0) {
            directiveFound = true;

            // remove flow directive
            comment.value = comment.value.replace(FLOW_DIRECTIVE, "");

            // remove the comment completely if it only consists of whitespace and/or stars
            if (!comment.value.replace(/\*/g, "").trim()) comment.ignore = true;
          }
        }

        if (!directiveFound && opts.requireDirective) {
          skipStrip = true;
        }
      },
      ImportDeclaration(path) {
        if (skipStrip) return;
        if (!path.node.specifiers.length) return;

        let typeCount = 0;

        path.node.specifiers.forEach(({ importKind }) => {
          if (importKind === "type" || importKind === "typeof") {
            typeCount++;
          }
        });

        if (typeCount === path.node.specifiers.length) {
          path.remove();
        }
      },

      Flow(path) {
        if (skipStrip) return;
        path.remove();
      },

      ClassProperty(path) {
        if (skipStrip) return;
        path.node.variance = null;
        path.node.typeAnnotation = null;
        if (!path.node.value) path.remove();
      },

      Class(path) {
        if (skipStrip) return;
        path.node.implements = null;

        // We do this here instead of in a `ClassProperty` visitor because the class transform
        // would transform the class before we reached the class property.
        path.get("body.body").forEach(child => {
          if (child.isClassProperty()) {
            child.node.typeAnnotation = null;
            if (!child.node.value) child.remove();
          }
        });
      },

      AssignmentPattern({ node }) {
        if (skipStrip) return;
        node.left.optional = false;
      },

      Function({ node }) {
        if (skipStrip) return;
        for (let i = 0; i < node.params.length; i++) {
          const param = node.params[i];
          param.optional = false;
          if (param.type === "AssignmentPattern") {
            param.left.optional = false;
          }
        }

        node.predicate = null;
      },

      TypeCastExpression(path) {
        if (skipStrip) return;
        let { node } = path;
        do {
          node = node.expression;
        } while (t.isTypeCastExpression(node));
        path.replaceWith(node);
      },
    },
  };
}
