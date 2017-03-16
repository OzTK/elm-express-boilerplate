export default class BaseContext {
  public title: string;
  public currentPath: string;

  constructor(title: string) {
    this.title = title;
  }
}