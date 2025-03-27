import { ProductDatasource } from "../../core/sources";
import { CreateProductDto } from "../../core/dtos/products/create-product.dto";
import { UpdateProductPriceDto } from "../../core/dtos/products/update-product-price.dto";
import { UpdateProductQuantityDto } from "../../core/dtos/products/update-product-quantity.dto";
import { UpdateProductDto } from "../../core/dtos/products/update-product.dto";
import { ProductEntity } from "../../core/entities";
import { ProductRepository } from "../../core/repositories";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly datasource: ProductDatasource) {}

  count(): Promise<number> {
    return this.datasource.count();
  }
  getRange(paginationDto: PaginationDto): Promise<ProductEntity[]> {
    return this.datasource.getRange(paginationDto);
  }
  getByName(name: string): Promise<ProductEntity | null> {
    return this.datasource.getByName(name);
  }
  existsById(id: number): Promise<boolean> {
    return this.datasource.existsById(id);
  }
  existsByName(name: string): Promise<boolean> {
    return this.datasource.existsByName(name);
  }
  existsByNameExcludingId(id: number, name: string): Promise<boolean> {
    return this.datasource.existsByNameExcludingId(id, name);
  }
  productHasOrders(id: number): Promise<boolean> {
    return this.datasource.productHasOrders(id);
  }

  create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.datasource.create(createProductDto);
  }

  getAll(paginationDto: PaginationDto): Promise<ProductEntity[]> {
    return this.datasource.getAll(paginationDto);
  }

  findById(id: number): Promise<ProductEntity | null> {
    return this.datasource.findById(id);
  }

  updateById(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    return this.datasource.updateById(id, updateProductDto);
  }

  deleteById(id: number): Promise<string> {
    return this.datasource.deleteById(id);
  }

  updateQuantityOnly(
    id: number,
    updateProductQuantityDto: UpdateProductQuantityDto
  ): Promise<ProductEntity> {
    return this.datasource.updateQuantityOnly(id, updateProductQuantityDto);
  }

  updatePriceOnly(
    id: number,
    updateProductPriceDto: UpdateProductPriceDto
  ): Promise<ProductEntity> {
    return this.datasource.updatePriceOnly(id, updateProductPriceDto);
  }
}
