import * as express from "express";

export = app

declare namespace app {
    interface IApp {
        init(): express.Express;
    }

    interface IServer {
        start(listenPort: number | string): void;
    }
}