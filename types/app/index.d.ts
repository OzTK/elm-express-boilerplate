export = app

declare namespace app {
    interface IApp {
        start(listenPort: number | string, url: string): void;
    }
}