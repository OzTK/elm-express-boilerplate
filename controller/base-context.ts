import User from "../model/user";
import App from "../app";

export default class BaseContext {
  public currentPath: string;
  public showTitle: boolean = false;
  public readonly appName: string;
  public readonly prod: boolean;

  constructor(public readonly title: string) {
    this.appName = App.getInstance().config.appName;
    this.prod = App.getInstance().config.env.prod;
  }
}
