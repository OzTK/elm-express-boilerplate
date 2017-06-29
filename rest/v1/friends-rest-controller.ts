import { interfaces, Controller, Get } from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response } from "express"
import TYPES from "../../di/types"
import VERSION from "./version";

@injectable()
@Controller(UsersRestController.BASE_PATH)
export default class UsersRestController implements interfaces.Controller {
  public static readonly TAG = "UsersRestController";
  public static readonly BASE_PATH = "/api/" + VERSION + "/users";
  private static readonly PATH_USERS = "/";
  private static readonly PATH_VERSION = "/version";

  private users = [
    { fname: "John", lname: "Snow", age: 27 },
    { fname: "Ned", lname: "Stark", age: 26 },
    { fname: "Rob", lname: "Stark", age: 54 },
    { fname: "Aria", lname: "Stark", age: 54 },
    { fname: "Bran", lname: "Stark", age: 54 },
    { fname: "Sanza", lname: "Stark", age: 54 },
    { fname: "Cathelyn", lname: "Stark", age: 25 },
    { fname: "Thyrion", lname: "Lannister", age: 30 },
    { fname: "Jamie", lname: "Lannister", age: 30 },
    { fname: "Cersei", lname: "Lannister", age: 10 },
    { fname: "Tywin", lname: "Lannister", age: 19 }
  ];

  @Get(UsersRestController.PATH_VERSION)
  public async get(req: Request, res: Response) {
    res.json({ v: VERSION });
  }

  @Get(UsersRestController.PATH_USERS)
  public async getUsers(req: Request, res: Response) {
    res.json(this.users);
  }
}