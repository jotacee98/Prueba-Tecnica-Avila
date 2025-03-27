export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly quantity: number
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param props - Object containing product properties
   * @returns A tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, price, description, quantity } = props;

    const error = this.validate({ name, price, description, quantity });
    if (error) return [error];

    return [undefined, new CreateProductDto(name, price, description, quantity)];
  }

  /**
   * Validates the product properties
   * @param product - An object containing product properties
   * @returns An error message or undefined if valid
   */
  private static validate(product: {
    name: any;
    price: any;
    description: any;
    quantity: any;
  }): string | undefined {
    const { name, price, description, quantity } = product;

    // Name validation
    if (!name || typeof name !== "string") return "Missing or invalid name";

    // Price validation
    if (price === undefined) return "Missing price";
    if (typeof price !== "number" || isNaN(price)) return "Price must be a valid number";
    if (price < 0) return "Price must be a positive number";

    // Description validation
    if (!description || typeof description !== "string") return "Missing or invalid description";

    // Quantity validation
    if (quantity === undefined) return "Missing quantity";
    if (typeof quantity !== "number" || isNaN(quantity)) return "Quantity must be a valid number";
    if (!Number.isInteger(quantity)) return "Quantity must be an integer";
    if (quantity < 0) return "Quantity must be a positive number";

    return undefined; // No validation errors
  }
}

