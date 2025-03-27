import { prisma } from "../../data/postgres";
import { OrderDatasource } from "../../core/sources";
import { UpdateOrderDto } from "../../core/dtos/orders/update-order-dto";
import { OrderEntity } from "../../core/entities";
import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { CustomError } from "../../core/errors/custom.error";

export class OrderDatasourceImpl implements OrderDatasource {
  async create(order: Omit<OrderEntity, "id">): Promise<OrderEntity> {
    const newOrder = await prisma.order.create({
      data: {
        userId: order.userId,
        status: order.status,
        OrderDetail: {
          create: order.products,
        },
      },
    });

    const returnOrder = await this.findById(newOrder.id);
    if (!returnOrder) throw CustomError.badRequest("Error creating order");

    return OrderEntity.fromObject(returnOrder);
  }

  async getAll(paginationDto: PaginationDto): Promise<OrderEntity[]> {
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;

    const orders = await prisma.order.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: {
        OrderDetail: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => OrderEntity.fromObject(order));
  }

  async getAllByUserId(
    id: number,
    paginationDto: PaginationDto
  ): Promise<OrderEntity[]> {
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;

    const orders = await prisma.order.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      where: {
        userId: id,
      },
      include: {
        OrderDetail: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => OrderEntity.fromObject(order));
  }

  async findById(id: number): Promise<OrderEntity | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderDetail: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return null;

    return OrderEntity.fromObject(order!);
  }

  async updateById(
    id: number,
    updateOrderDto: UpdateOrderDto
  ): Promise<OrderEntity> {
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: updateOrderDto,
    });

    return OrderEntity.fromObject(order);
  }

  async deleteById(id: number): Promise<string> {
    await prisma.orderDetail.deleteMany({
      where: {
        orderId: id,
      },
    });
    await prisma.order.delete({
      where: {
        id,
      },
    });

    return `Order with id:${id} deleted successfully`;
  }

  async count(): Promise<number> {
    return await prisma.order.count();
  }

  async countByUserId(userId: number): Promise<number> {
    return await prisma.order.count({
      where: {
        userId,
      },
    });
  }

  async existsById(id: number): Promise<boolean> {
    return Boolean(
      await prisma.order.findUnique({
        where: {
          id,
        },
      })
    );
  }
}
