interface Product {
  id: number;
  quantity: number;
}

export class GenerateOrderDto {
  private constructor(public readonly products: Product[]) {}

  /**
   * Static method to create a DTO with validation
   * @param props - object containing the list of products
   * @returns a tuple [error?, dto?]
   */
  static create(props: { products?: any[] }): [string?, GenerateOrderDto?] {
    const { products } = props;

    if (!Array.isArray(products) || products.length === 0) {
      return ["Products must be a non-empty array"];
    }

    const errors: string[] = [];

    const validProducts = products
      .map((p) => this.validateProduct(p))
      .filter((result): result is Product => {
        if (typeof result === "string") {
          errors.push(result);
          return false;
        }
        return true;
      });

    if (errors.length > 0) {
      return [errors.join(", ")];
    }

    return [undefined, new GenerateOrderDto(validProducts)];
  }

  /**
   * Validates a single product
   * @param product - The product to validate
   * @returns A valid product or an error string
   */
  private static validateProduct(product: any): Product | string {
    if (!product || typeof product !== "object") return "Invalid product object";

    const { id, quantity } = product;

    if (typeof id !== "number" || !Number.isInteger(id) || id < 0) {
      return "Invalid or missing id";
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return "Invalid or missing quantity";
    }

    return { id, quantity };
  }
}

