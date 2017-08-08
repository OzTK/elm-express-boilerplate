export = app

declare namespace app {
    interface IApp {
        start(listenPort: number | string): void;
    }
}