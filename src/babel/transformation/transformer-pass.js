import includes from "lodash/collection/includes";
import traverse from "../traversal";

/**
 * This class is responsible for traversing over the provided `File`s
 * AST and running it's parent transformers handlers over it.
 */

export default class TransformerPass {
  constructor(file: File, transformer: Transformer) {
    this.transformer = transformer;
    this.handlers    = transformer.handlers;
    this.skipKey     = transformer.skipKey;
    this.file        = file;
    this.ran         = false;
  }

  canTransform(): boolean {
    return this.file.pipeline.canTransform(this.transformer, this.file.opts);
  }

  transform() {
    var file = this.file;

    file.log.debug(`Start transformer ${this.transformer.key}`);

    traverse(file.ast, this.handlers, file.scope, file);

    file.log.debug(`Finish transformer ${this.transformer.key}`);

    this.ran = true;
  }
}
