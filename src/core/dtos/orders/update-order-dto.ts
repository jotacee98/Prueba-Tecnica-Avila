import {
  OrderStatus,
  orderStatus,
} from "../../../shared/types/order-status.type";

export class UpdateOrderDto {
  constructor(public readonly status: OrderStatus) {}

  /**
   * Static method to create a DTO with validation
   * @param props - object containing the order status
   * @returns a tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, UpdateOrderDto?] {
    const { status } = props;

    const error = this.validate(status);
    if (error) return [error];

    return [undefined, new UpdateOrderDto(status)];
  }

  /**
   * Validates the order status
   * @param status - The order status to validate
   * @returns An error message or undefined if valid
   */
  private static validate(status: any): string | undefined {
    // Check if status is missing or invalid
    if (!status || typeof status !== "string") {
      return "Missing or invalid status";
    }

    // Ensure the status is part of the valid order statuses
    if (!orderStatus.includes(status as OrderStatus)) {
      return `Invalid status: ${status}. Valid statuses are: ${orderStatus.join(", ")}`;
    }

    return undefined; // No errors
  }
}

