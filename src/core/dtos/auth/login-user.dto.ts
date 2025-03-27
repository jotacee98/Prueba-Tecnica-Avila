import { regularExps } from "../../../shared/regular-expressions/regular-exp";

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param object - object containing the login properties
   * @returns a tuple [error?, dto?]
   */
  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    const error = this.validate(email, password);
    if (error) return [error];

    return [undefined, new LoginUserDto(email, password)];
  }

  /**
   * Validates the login properties
   * @param email - User email
   * @param password - User password
   * @returns An error message or undefined if valid
   */
  private static validate(email: any, password: any): string | undefined {
    
    // Email validation

    if (!email || typeof email !== "string" || !regularExps.email.test(email)) {
      return "Invalid or missing email";
    }

    // Password validation
    if (!password || typeof password !== "string" || password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    return undefined; // No errors
  }
}

