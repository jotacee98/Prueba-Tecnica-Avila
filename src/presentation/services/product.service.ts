import { CreateProductDto } from "../../core/dtos/products/create-product.dto";
import { UpdateProductQuantityDto } from "../../core/dtos/products/update-product-quantity.dto";
import { CustomError } from "../../core/errors/custom.error";
import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { UpdateProductPriceDto } from "../../core/dtos/products/update-product-price.dto";
import { ProductRepository } from "../../core/repositories";
import { UpdateProductDto } from "../../core/dtos/products/update-product.dto";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  public async getAllProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        this.repository.count(),
        this.repository.getRange(paginationDto),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        data: products,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async getProductById(id: number) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw CustomError.notFound("Product not found");
    }
    return product;
  }

  public async createProduct(createProductDto: CreateProductDto) {
    const exists = await this.repository.existsByName(createProductDto.name);

    if (exists) {
      throw CustomError.badRequest("Product already exists");
    }

    try {
      const product = await this.repository.create(createProductDto);

      return product;
    } catch (error) {
      console.log(error);

      throw CustomError.internalServer();
    }
  }

  public async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const exists = await this.repository.existsById(id);
    if (!exists) {
      throw CustomError.notFound("Product not found");
    }

    const hasOrders = await this.repository.productHasOrders(id);
    if (hasOrders) {
      throw CustomError.badRequest(
        "Product was already ordered and cannot be updated"
      );
    }

    const productByNameExists = await this.repository.existsByNameExcludingId(
      id,
      updateProductDto.name
    );
    if (productByNameExists) {
      throw CustomError.badRequest("Product name already exists");
    }

    try {
      const product = await this.repository.updateById(id, updateProductDto);
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async deleteProduct(id: number) {
    const exists = await this.repository.existsById(id);

    if (!exists) {
      throw CustomError.notFound("Product not found");
    }

    const hasOrders = await this.repository.productHasOrders(id);
    if (hasOrders) {
      throw CustomError.badRequest(
        "Product was already ordered and cannot be deleted"
      );
    }

    try {
      const product = await this.repository.deleteById(id);
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async updateProductQuantity(
    id: number,
    updateProductQuantityDto: UpdateProductQuantityDto
  ) {
    const exists = await this.repository.existsById(id);
    if (!exists) {
      throw CustomError.notFound("Product not found");
    }

    try {
      const product = await this.repository.updateQuantityOnly(
        id,
        updateProductQuantityDto
      );
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async updateProductPrice(
    id: number,
    updateProductPriceDto: UpdateProductPriceDto
  ) {
    const exists = await this.repository.existsById(id);
    if (!exists) {
      throw CustomError.notFound("Product not found");
    }

    try {
      const product = await this.repository.updatePriceOnly(
        id,
        updateProductPriceDto
      );
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
