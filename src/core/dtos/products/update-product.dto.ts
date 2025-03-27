export class UpdateProductDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly quantity: number
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param props - Object containing the product fields
   * @returns A tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, UpdateProductDto?] {
    const { name, price, description, quantity } = props;

    const error = this.validate({ name, price, description, quantity });
    if (error) return [error];

    return [undefined, new UpdateProductDto(name, price, description, quantity)];
  }

  /**
   * Validates product properties
   * @param props - Object containing the product fields
   * @returns An error message or undefined if valid
   */
  private static validate(props: {
    name: any;
    price: any;
    description: any;
    quantity: any;
  }): string | undefined {
    const { name, price, description, quantity } = props;

    // Name validation
    if (name === undefined) return "Missing name";
    if (typeof name !== "string") return "Name must be a string";

    // Price validation
    if (price === undefined) return "Missing price";
    if (typeof price !== "number" || isNaN(price)) return "Price must be a valid number";
    if (price < 0) return "Price must be a positive number";

    // Description validation
    if (description === undefined) return "Missing description";
    if (typeof description !== "string") return "Description must be a string";

    // Quantity validation
    if (quantity === undefined) return "Missing quantity";
    if (typeof quantity !== "number" || isNaN(quantity)) return "Quantity must be a valid number";
    if (!Number.isInteger(quantity)) return "Quantity must be an integer";
    if (quantity < 0) return "Quantity must be a positive number";

    return undefined; // No validation errors
  }
}

