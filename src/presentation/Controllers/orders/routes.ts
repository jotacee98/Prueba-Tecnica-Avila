import { Router } from "express";
import { OrderDatasourceImpl } from "../../../infrastructure/sources/order.datasource.impl";
import { ProductDatasourceImpl } from "../../../infrastructure/sources/product.datasource.impl";
import { UserDatasourceImpl } from "../../../infrastructure/sources/user.datasource.impl";
import {
  OrderRepositoryImpl,
  UserRepositoryImpl,
  ProductRepositoryImpl,
} from "../../../infrastructure/repositories";
import { AdminMiddleware } from "../../middleware/admin.middleware";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { OrderService } from "../../services";
import { OrderController } from "./controller";

export class OrderRoutes {
  static get routes(): Router {
    const router = Router();

    const orderDatasource = new OrderDatasourceImpl();
    const orderRepository = new OrderRepositoryImpl(orderDatasource);

    const userDatasource = new UserDatasourceImpl();
    const userRepository = new UserRepositoryImpl(userDatasource);

    const productDatasource = new ProductDatasourceImpl();
    const productRepository = new ProductRepositoryImpl(productDatasource);

    const ordersService = new OrderService(
      orderRepository,
      userRepository,
      productRepository
    );

    const ordersController = new OrderController(ordersService);

    router.use(AuthMiddleware.validateJWT);

    router.get(
      "/",
      AdminMiddleware.validateAdmin,
      ordersController.getAllOrders
    );
    router.get("/:id", ordersController.getOrderById);
    router.get("/user/:id", ordersController.getAllOrdersByUserId);
    router.post("/", ordersController.generateOrder);
    router.delete(
      "/:id",
      AdminMiddleware.validateAdmin,
      ordersController.deleteOrder
    );
    router.patch(
      "/:id/status",
      AdminMiddleware.validateAdmin,
      ordersController.updateOrderStatus
    );

    return router;
  }
}
