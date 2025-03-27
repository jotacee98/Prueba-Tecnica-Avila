export class UpdateProductQuantityDto {
  private constructor(public readonly quantity: number) {}

  /**
   * Static method to create a DTO with validation
   * @param props - Object containing the new quantity
   * @returns A tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, UpdateProductQuantityDto?] {
    const { quantity } = props;

    const error = this.validate(quantity);
    if (error) return [error];

    return [undefined, new UpdateProductQuantityDto(quantity)];
  }

  /**
   * Validates the quantity
   * @param quantity - The new quantity value
   * @returns An error message or undefined if valid
   */
  private static validate(quantity: any): string | undefined {
    if (quantity === undefined) return "Missing quantity";
    if (typeof quantity !== "number" || isNaN(quantity)) return "Quantity must be a valid number";
    if (!Number.isInteger(quantity)) return "Quantity must be an integer number";
    if (quantity < 0) return "Quantity must be a positive number";

    return undefined; // No validation errors
  }
}

