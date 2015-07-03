import * as t from "../../types";

/**
 * [Please add a description.]
 */

export function JSXAttribute(node, print) {
  print.plain(node.name);
  if (node.value) {
    this.push("=");
    print.plain(node.value);
  }
}

/**
 * [Please add a description.]
 */

export function JSXIdentifier(node) {
  this.push(node.name);
}

/**
 * [Please add a description.]
 */

export function JSXNamespacedName(node, print) {
  print.plain(node.namespace);
  this.push(":");
  print.plain(node.name);
}

/**
 * [Please add a description.]
 */

export function JSXMemberExpression(node, print) {
  print.plain(node.object);
  this.push(".");
  print.plain(node.property);
}

/**
 * [Please add a description.]
 */

export function JSXSpreadAttribute(node, print) {
  this.push("{...");
  print.plain(node.argument);
  this.push("}");
}

/**
 * [Please add a description.]
 */

export function JSXExpressionContainer(node, print) {
  this.push("{");
  print.plain(node.expression);
  this.push("}");
}

/**
 * [Please add a description.]
 */

export function JSXElement(node, print) {
  var open = node.openingElement;
  print.plain(open);
  if (open.selfClosing) return;

  this.indent();
  for (var child of (node.children: Array)) {
    if (t.isLiteral(child)) {
      this.push(child.value, true);
    } else {
      print.plain(child);
    }
  }
  this.dedent();

  print.plain(node.closingElement);
}

/**
 * [Please add a description.]
 */

export function JSXOpeningElement(node, print) {
  this.push("<");
  print.plain(node.name);
  if (node.attributes.length > 0) {
    this.push(" ");
    print.join(node.attributes, { separator: " " });
  }
  this.push(node.selfClosing ? " />" : ">");
}

/**
 * [Please add a description.]
 */

export function JSXClosingElement(node, print) {
  this.push("</");
  print.plain(node.name);
  this.push(">");
}

/**
 * [Please add a description.]
 */

export function JSXEmptyExpression() {}
