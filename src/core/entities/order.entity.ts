import { OrderStatus } from "../../shared/types/order-status.type";
import { OrderDetailEntity } from "./order-detail";

export class OrderEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly status: OrderStatus,
    public readonly products: OrderDetailEntity[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static fromObject(obj: { [key: string]: any }): OrderEntity {
    const { id, userId, status, OrderDetail, createdAt, updatedAt } = obj;

    return new OrderEntity(
      id,
      userId,
      status as OrderStatus,
      OrderDetail?.map((product: { [key: string]: any }) =>
        OrderDetailEntity.fromObject(product)
      ),
      new Date(createdAt),
      new Date(updatedAt)
    );
  }
}
