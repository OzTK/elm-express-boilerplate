import * as express from "express";

export = app

declare namespace app {
    interface IApp {
        getConfig(): any;
        start(listenPort: number | string): void;
    }
}