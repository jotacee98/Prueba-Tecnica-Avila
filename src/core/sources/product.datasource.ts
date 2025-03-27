import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { CreateProductDto } from "../dtos/products/create-product.dto";
import { UpdateProductPriceDto } from "../dtos/products/update-product-price.dto";
import { UpdateProductQuantityDto } from "../dtos/products/update-product-quantity.dto";
import { UpdateProductDto } from "../dtos/products/update-product.dto";
import { ProductEntity } from "../entities";

export abstract class ProductDatasource {
  abstract create(createProductDto: CreateProductDto): Promise<ProductEntity>;

  abstract getAll(paginationDto: PaginationDto): Promise<ProductEntity[]>;

  abstract findById(id: number): Promise<ProductEntity | null>;
  abstract updateById(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity>;
  abstract deleteById(id: number): Promise<string>;

  abstract updateQuantityOnly(
    id: number,
    updateProductQuantityDto: UpdateProductQuantityDto
  ): Promise<ProductEntity>;

  abstract updatePriceOnly(
    id: number,
    updateProductPriceDto: UpdateProductPriceDto
  ): Promise<ProductEntity>;

  abstract count(): Promise<number>;

  abstract getRange(paginationDto: PaginationDto): Promise<ProductEntity[]>;

  abstract getByName(name: string): Promise<ProductEntity | null>;

  abstract existsById(id: number): Promise<boolean>;

  abstract existsByName(name: string): Promise<boolean>;

  abstract existsByNameExcludingId(id: number, name: string): Promise<boolean>;

  abstract productHasOrders(id: number): Promise<boolean>;
}
