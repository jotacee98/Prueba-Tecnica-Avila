export class UpdateProductPriceDto {
  private constructor(public readonly price: number) {}

  /**
   * Static method to create a DTO with validation
   * @param props - Object containing the new price
   * @returns A tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, UpdateProductPriceDto?] {
    const { price } = props;

    const error = this.validate(price);
    if (error) return [error];

    return [undefined, new UpdateProductPriceDto(price)];
  }

  /**
   * Validates the price
   * @param price - The new price value
   * @returns An error message or undefined if valid
   */
  private static validate(price: any): string | undefined {
    if (price === undefined) return "Missing price";
    if (typeof price !== "number" || isNaN(price)) return "Price must be a valid number";
    if (price < 0) return "Price must be a positive number";

    return undefined; // No validation errors
  }
}
