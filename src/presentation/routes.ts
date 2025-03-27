import { Router } from "express";
import { UserRoutes } from "./Controllers/users/routes";
import { AuthRoutes } from "./auth/routes";
import { OrderRoutes } from "./Controllers/orders/routes";
import { ProductRoutes } from "./Controllers/products/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/users", UserRoutes.routes);
    router.use("/api/orders", OrderRoutes.routes);
    router.use("/api/products", ProductRoutes.routes);
    router.use("/api/auth", AuthRoutes.routes);

    return router;
  }
}
