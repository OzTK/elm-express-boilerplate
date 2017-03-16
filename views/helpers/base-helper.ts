import { HBS } from "hbs";

export abstract class BaseHelper {
  private hbs: HBS;

  constructor(hbs: HBS) {
    this.hbs = hbs;
  };

  protected registerHelper(name: string, fn: Function): void {
    this.hbs.registerHelper(name, fn);
  }

  abstract register(): void;
}