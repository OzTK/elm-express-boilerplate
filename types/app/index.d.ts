export = app

declare namespace app {
    interface IApp {
        config: any;
        start(listenPort: number | string): void;
    }
}