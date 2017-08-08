import User from "../model/user";
import App from "../app";
import * as config from "config";

export default class BaseContext {
  public currentPath: string;
  public showTitle: boolean = false;
  public readonly appName: string;
  public readonly prod: boolean;
  public readonly url: string;

  constructor(public readonly title: string) {
    this.appName = config.get("appName");
    this.prod = config.get("env.prod");
    this.url = config.get<string>("env.url") + ":" + config.get<string>("env.port");
  }
}
