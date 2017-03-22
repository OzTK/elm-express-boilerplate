import { Router, Request, Response, NextFunction, RequestHandler } from "express"

export abstract class BaseController {
  private router: Router;

  constructor(paths: Dictionary<HttpMethod>) {
    this.router = Router();

    Object.keys(paths).forEach(p => {
      switch (paths[p]) {
        case HttpMethod.GET:
          this.router.get(p, (req: Request, res: Response, next: NextFunction) => this.get(p, req, res, next));
          break;
        case HttpMethod.POST:
          this.router.post(p, (req: Request, res: Response, next: NextFunction) => this.post(p, req, res, next));
          break;
        case HttpMethod.HEAD:
          this.router.head(p, (req: Request, res: Response, next: NextFunction) => this.head(p, req, res, next));
          break;
        case HttpMethod.PUT:
          this.router.put(p, (req: Request, res: Response, next: NextFunction) => this.put(p, req, res, next));
          break;
        case HttpMethod.DELETE:
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

export enum HttpMethod {
  HEAD,
  GET,
  POST,
  PUT,
  DELETE,
  ANY
}