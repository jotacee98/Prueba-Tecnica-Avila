import { Router } from "express";
import { AuthController } from "./controller";
import { envs } from "../../config/envs";
import { UserDatasourceImpl } from "../../infrastructure/sources/user.datasource.impl";
import { UserRepositoryImpl } from "../../infrastructure/repositories";
import { AuthService } from "../services";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const authService = new AuthService(userRepository);

    const authController = new AuthController(authService);

    router.post("/login", authController.login);
    router.post("/register", authController.register);


    return router;
  }
}
