import User from "../model/user";
import * as config from "config";

export default class BaseContext {
  public currentPath: string;
  public showTitle: boolean = false;
  public readonly appName: string;
  public readonly prod: boolean;

  constructor(public readonly title: string) {
    this.appName = config.get("appName");
    this.prod = config.get("env.production");
  }
}
