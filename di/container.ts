import "reflect-metadata";

import { Container } from "inversify";
import { interfaces, TYPE } from "inversify-express-utils";
import UsersRestController from "../rest/v1/users-rest-controller";
import HomeController from "../controller/home-controller";
import UsersController from "../controller/users-controller";

function getContainer(config: any): Container {
  const container = new Container();

  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(HomeController)
    .whenTargetNamed(HomeController.TAG);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersController)
    .whenTargetNamed(UsersController.TAG);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersRestController)
    .whenTargetNamed(UsersRestController.TAG);

  return container;
}

export default getContainer;
