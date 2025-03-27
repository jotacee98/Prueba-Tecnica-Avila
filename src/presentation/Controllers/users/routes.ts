import { Router } from "express";
import { UserDatasourceImpl } from "../../../infrastructure/sources/user.datasource.impl";
import { UserRepositoryImpl } from "../../../infrastructure/repositories";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { UserService } from "../../services";
import { UserController } from "./controller";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(datasource);

    const usersService = new UserService(userRepository);

    const usersController = new UserController(usersService);

    router.use(AuthMiddleware.validateJWT);

    router.get("/", usersController.getAllUsers);
    router.get("/:id", usersController.getUserById);
    router.post("/", usersController.createUser);
    router.put("/:id", usersController.updateUser);
    router.delete("/:id", usersController.deleteUser);

    return router;
  }
}
