import { BaseHelper } from "./base-helper";

export default class JsonHelper extends BaseHelper {

  register() {
    const self = this;
    this.registerHelper("json", function (obj: any) {
      return JSON.stringify(obj);
    });
  }
}