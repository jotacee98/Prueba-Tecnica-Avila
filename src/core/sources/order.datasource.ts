import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { OrderEntity } from "../entities";
import { UpdateOrderDto } from "../dtos/orders/update-order-dto";

export abstract class OrderDatasource {
  abstract create(order: Omit<OrderEntity, "id">): Promise<OrderEntity>;

  abstract getAll(paginationDto: PaginationDto): Promise<OrderEntity[]>;

  abstract getAllByUserId(
    id: number,
    paginationDto: PaginationDto
  ): Promise<OrderEntity[]>;

  abstract findById(id: number): Promise<OrderEntity | null>;

  abstract updateById(
    id: number,
    updateOrderDto: UpdateOrderDto
  ): Promise<OrderEntity>;

  abstract deleteById(id: number): Promise<string>;

  abstract count(): Promise<number>;

  abstract countByUserId(id: number): Promise<number>;

  abstract existsById(id: number): Promise<boolean>;
}
