import User from "../models/user";
import App from "../app";

export default class BaseContext {
  public currentPath: string;
  public showTitle: boolean = false;
  public readonly appName: string;

  constructor(public readonly title: string) {
    this.appName = App.getInstance().getConfig().appName;
  }
}