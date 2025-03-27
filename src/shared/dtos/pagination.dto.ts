export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param page - Current page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns A tuple [error?, dto?]
   */
  static create(
    page: number = 1,
    limit: number = 10
  ): [string?, PaginationDto?] {
    const error = this.validate(page, limit);
    if (error) return [error];

    return [undefined, new PaginationDto(page, limit)];
  }

  /**
   * Validates the page and limit values
   * @param page - Current page number
   * @param limit - Number of items per page
   * @returns An error message or undefined if valid
   */
  private static validate(page: any, limit: any): string | undefined {
    // Type validation
    if (typeof page !== "number" || typeof limit !== "number") {
      return "Page & Limit must be numbers";
    }

    // Page validation
    if (!Number.isInteger(page) || page <= 0) {
      return "Page must be a positive integer greater than 0";
    }

    // Limit validation
    if (!Number.isInteger(limit) || limit <= 0) {
      return "Limit must be a positive integer greater than 0";
    }

    return undefined; // No validation errors
  }
}

