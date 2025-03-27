import { prisma } from "../../data/postgres";
import { ProductDatasource } from "../../core/sources";
import { ProductEntity } from "../../core/entities";
import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { CreateProductDto } from "../../core/dtos/products/create-product.dto";
import { UpdateProductDto } from "../../core/dtos/products/update-product.dto";
import { UpdateProductPriceDto } from "../../core/dtos/products/update-product-price.dto";
import { UpdateProductQuantityDto } from "../../core/dtos/products/update-product-quantity.dto";

export class ProductDatasourceImpl implements ProductDatasource {
  async count(): Promise<number> {
    return await prisma.product.count();
  }

  async getAll(): Promise<ProductEntity[]> {
    const product = await prisma.product.findMany();
    return product.map((product) => ProductEntity.fromObject(product));
  }

  async getRange(paginationDto: PaginationDto): Promise<ProductEntity[]> {
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;
    const products = await prisma.product.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });

    return products.map((product) => ProductEntity.fromObject(product));
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) return null;

    return ProductEntity.fromObject(product!);
  }

  async getByName(name: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: {
        name,
      },
    });

    return ProductEntity.fromObject(product!);
  }

  async existsById(id: number): Promise<boolean> {
    return Boolean(
      await prisma.product.findUnique({
        where: {
          id,
        },
      })
    );
  }

  async existsByName(name: string): Promise<boolean> {
    return Boolean(
      await prisma.product.findUnique({
        where: {
          name,
        },
      })
    );
  }

  async existsByNameExcludingId(id: number, name: string): Promise<boolean> {
    return Boolean(
      await prisma.product.findFirst({
        where: {
          id: {
            not: id,
          },
          name,
        },
      })
    );
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = await prisma.product.create({
      data: createProductDto!,
    });

    return ProductEntity.fromObject(product);
  }

  async updateById(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<ProductEntity> {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto!,
    });

    return ProductEntity.fromObject(product);
  }

  async deleteById(id: number): Promise<string> {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return "Product deleted successfully";
  }

  async updateQuantityOnly(
    id: number,
    updateProductQuantityDto: UpdateProductQuantityDto
  ): Promise<ProductEntity> {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        quantity: updateProductQuantityDto.quantity,
      },
    });

    return ProductEntity.fromObject(product);
  }

  async updatePriceOnly(
    id: number,
    updateProductPriceDto: UpdateProductPriceDto
  ): Promise<ProductEntity> {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        price: updateProductPriceDto.price,
      },
    });

    return ProductEntity.fromObject(product);
  }

  async productHasOrders(id: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        OrderDetail: true,
      },
    });

    return Boolean(product?.OrderDetail.length);
  }
}
