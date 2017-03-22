import { createServer, Server as HttpServer,  } from "http";
import * as debug from "debug";
import { IApp, IServer } from 'app'

export default class Server implements IServer {
  private app: IApp;
  private httpServer: HttpServer;
  private port: string | number;
  private debug: debug.IDebugger

  constructor(app: IApp) {
    this.app = app;
    this.debug = debug("testexpress:server");
  }

  /**
   * Starts the server using the app it was constructed with.
   * @param listenPort port for the server to listen on
   */
  start(listenPort: string | number): void {
    const expressApp = this.app.init();

    this.httpServer = createServer(expressApp);

    this.port = this.normalizePort(listenPort);
    expressApp.set("port", this.port);

    this.httpServer.listen(this.port);
    this.httpServer.on("error", this.onError.bind(this));
    this.httpServer.on("listening", this.onListening.bind(this));
  }

  /**
   * Normalize a port into a number, string, or false.
   * @param port port value to normalize
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
   * @param error error sent by HTTP server
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