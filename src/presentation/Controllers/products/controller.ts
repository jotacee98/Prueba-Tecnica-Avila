import { Request, Response } from "express";
import { CustomError } from "../../../core/errors/custom.error";
import { PaginationDto } from "../../../shared/dtos/pagination.dto";
import { CreateProductDto } from "../../../core/dtos/products/create-product.dto";
import { UpdateProductQuantityDto } from "../../../core/dtos/products/update-product-quantity.dto";
import { UpdateProductPriceDto } from "../../../core/dtos/products/update-product-price.dto";
import { UpdateProductDto } from "../../../core/dtos/products/update-product.dto";
import { ProductService } from "../../services";

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  public getAllProducts = async (req: Request, res: Response): Promise<any> => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.productService
      .getAllProducts(paginationDto!)
      .then((products) => res.json(products))
      .catch((error) => this.handleError(error, res));
  };

  public getProductById = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    this.productService
      .getProductById(id)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };

  public createProduct = async (req: Request, res: Response): Promise<any> => {
    const [error, createProductDto] = CreateProductDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.productService
      .createProduct(createProductDto!)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };

  public updateProduct = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const [error, updateProductDto] = UpdateProductDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.productService
      .updateProduct(id, updateProductDto!)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };

  public deleteProduct = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    this.productService
      .deleteProduct(id)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };

  public updateProductQuantity = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const [error, updateProductQuantityDto] = UpdateProductQuantityDto.create(
      req.body
    );

    if (error) return res.status(400).json({ error });

    this.productService
      .updateProductQuantity(id, updateProductQuantityDto!)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };

  public updateProductPrice = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const [error, updateProductPriceDto] = UpdateProductPriceDto.create(
      req.body
    );

    if (error) return res.status(400).json({ error });

    this.productService
      .updateProductPrice(id, updateProductPriceDto!)
      .then((product) => res.json(product))
      .catch((error) => this.handleError(error, res));
  };
}
