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
    this.prod = config.get("env.production");

    const url = config.get<string>("env.url");
    if (!url.startsWith("http")) {
      this.url = "http://";
    }
    
    this.url += url + ":" + config.get<string>("env.port");
  }
}
