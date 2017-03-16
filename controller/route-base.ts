import { Router, Request, Response, NextFunction, RequestHandler } from "express"

export abstract class RouteBase {
  private router: Router;

  constructor(paths: Dictionary<Method>) {
    this.router = Router();

    Object.keys(paths).forEach(p => {
      switch (paths[p]) {
        case Method.GET:
          this.router.get(p, (req: Request, res: Response, next: NextFunction) => this.get(p, req, res, next));
          break;
        case Method.POST:
          this.router.post(p, (req: Request, res: Response, next: NextFunction) => this.post(p, req, res, next));
          break;
        case Method.HEAD:
          this.router.head(p, (req: Request, res: Response, next: NextFunction) => this.head(p, req, res, next));
          break;
        case Method.PUT:
          this.router.put(p, (req: Request, res: Response, next: NextFunction) => this.put(p, req, res, next));
          break;
        case Method.DELETE:
          this.router.delete(p, (req: Request, res: Response, next: NextFunction) => this.delete(p, req, res, next));
          break;
        default:
          this.router.all(p, (req: Request, res: Response, next: NextFunction) => this.all(p, req, res, next));
          break;
      }
    });
  }

  protected head(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected get(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected post(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected put(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected delete(path: string, req: Request, res: Response, next: NextFunction): any {};
  protected all(path: string, req: Request, res: Response, next: NextFunction): any {};

  getRouter() {
    return this.router;
  }
}

export enum Method {
  HEAD,
  GET,
  POST,
  PUT,
  DELETE,
  ANY
}