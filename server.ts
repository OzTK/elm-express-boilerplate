import { createServer, Server as HttpServer,  } from "http";
import * as debug from "debug";
import App from "./app";

export default class Server {
  private app: App;
  private httpServer: HttpServer;
  private port: string | number;
  private debug: debug.IDebugger

  constructor(app: App) {
    this.app = app;
    this.debug = debug("testexpress:server");
  }

  start(listenPort: string | number) {
    const expressApp = this.app.init();

    /**
     * Create HTTP server.
     */

    this.httpServer = createServer(expressApp);

    this.port = this.normalizePort(listenPort);
    expressApp.set("port", this.port);

    /**
     * Listen on provided port, on all network interfaces.
     */

    this.httpServer.listen(this.port);
    this.httpServer.on("error", this.onError.bind(this));
    this.httpServer.on("listening", this.onListening.bind(this));
  }

  /**
   * Normalize a port into a number, string, or false.
   */

  private normalizePort(port: string | number): any {
    if (typeof port === "string") {
      // named pipe
      return port;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  private onError(error: any) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof this.port === "string"
      ? "Pipe " + this.port
      : "Port " + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  private onListening() {
    const addr = this.httpServer.address();
    const bind = typeof addr === "string"
      ? "pipe " + addr
      : "port " + addr.port;
    this.debug("Listening on " + bind);
  }
}