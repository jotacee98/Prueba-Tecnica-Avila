import { ProductEntity } from "./product.entity";

export class OrderDetailEntity {
  constructor(
    public readonly orderId: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly product: ProductEntity
  ) {}

  static fromObject(props: { [key: string]: any }): OrderDetailEntity {
    return new OrderDetailEntity(
      props.orderId,
      props.productId,
      props.quantity,
      props.unitPrice,
      props.product
    );
  }
}
