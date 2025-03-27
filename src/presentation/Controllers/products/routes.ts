import { Router } from "express";
import { ProductDatasourceImpl } from "../../../infrastructure/sources/product.datasource.impl";
import { ProductRepositoryImpl } from "../../../infrastructure/repositories";
import { AdminMiddleware } from "../../middleware/admin.middleware";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { ProductService } from "../../services";
import { ProductController } from "./controller";

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new ProductDatasourceImpl();
    const productRepository = new ProductRepositoryImpl(datasource);

    const productsService = new ProductService(productRepository);
    const productsController = new ProductController(productsService);

    router.use(AuthMiddleware.validateJWT);

    router.get("/", productsController.getAllProducts);
    router.get("/:id", productsController.getProductById);
    router.post(
      "/",
      AdminMiddleware.validateAdmin,
      productsController.createProduct
    );
    router.put(
      "/:id",
      AdminMiddleware.validateAdmin,
      productsController.updateProduct
    );
    router.delete(
      "/:id",
      AdminMiddleware.validateAdmin,
      productsController.deleteProduct
    );
    router.patch(
      "/:id/quantity",
      AdminMiddleware.validateAdmin,
      productsController.updateProductQuantity
    );
    router.patch(
      "/:id/price",
      AdminMiddleware.validateAdmin,
      productsController.updateProductPrice
    );

    return router;
  }
}
