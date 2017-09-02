import { Container } from "inversify";

export default interface App {
  init(container: Container): Promise<void>;
  start(port: number, url: string): Promise<void>;
}