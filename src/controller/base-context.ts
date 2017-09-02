import User from "../model/user";
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
    this.url = "";
    if (!url.startsWith("http")) {
      this.url = "http://";
    }
    
    this.url += url;

    const port = config.get<number>("env.port");
    if (port !== 80) {
      this.url += ":" + port;
    }
  }
}
