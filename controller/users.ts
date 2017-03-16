import { RouteBase, Method } from "./route-base";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import BaseContext from "./base-context";

export default class Users extends RouteBase {
  public static readonly BASE_PATH = "/users";
  private static readonly PATH_ROOT = "/";

  private users = [
    { fname: "John", lname: "Snow", age: 27 },
    { fname: "Ned", lname: "Stark", age: 26 },
    { fname: "Rob", lname: "Stark", age: 54 },
    { fname: "Aria", lname: "Stark", age: 54 },
    { fname: "Bran", lname: "Stark", age: 54 },
    { fname: "Catherine", lname: "Stark", age: 25 },
    { fname: "Thyrion", lname: "Lannister", age: 30 },
    { fname: "Cersei", lname: "Lannister", age: 10 },
    { fname: "Tywin", lname: "Lannister", age: 19 }
  ];

  constructor() {
    super({ [Users.PATH_ROOT]: Method.GET });
  }

  protected get(path: string, req: Request, res: Response, next: NextFunction): any {
    if (path == Users.PATH_ROOT) {
      let ctx = this.searchUsers(req.query.search ? req.query.search : "");
      res.render("users", { context: ctx });
    }
  };

  private searchUsers(terms: string): UsersContext {
    let context = new UsersContext(terms);
    context.users = this.users;
    context.filtered = context.search ? context.users.filter(u => u.fname === context.search || u.lname === context.search) : this.users;

    return context;
  }
}

class UsersContext extends BaseContext {
  users: Array<User>;
  filtered: Array<User>;
  search: string;

  constructor(search: string) {
    super(null);
    this.search = search;
    this.title = "My Users";
  };
}