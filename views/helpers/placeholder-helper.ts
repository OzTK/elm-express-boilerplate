import { BaseHelper } from "./base-helper";

export default class HandlebarsPlaceholderHelper extends BaseHelper {
  private blocks: { [name: string]: any[] } = {};

  register() {
    const self = this;
    this.registerHelper("placeholder", function (name: string) {
      const concatenatedBlocks = (self.blocks[name] || []).join("\n");
      self.blocks[name] = [];
      return concatenatedBlocks;
    });

    this.registerHelper("placeholder-content", function (name: string, context: any) {
      let block = self.blocks[name];

      if (!block) {
        block = self.blocks[name] = [];
      }

      block.push(context.fn(this));
    });
  }
}