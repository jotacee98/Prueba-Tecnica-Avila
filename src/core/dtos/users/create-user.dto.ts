import { regularExps } from "../../../shared/regular-expressions/regular-exp";
import { UserRole, userRole } from "../../../shared/types/user.type";

export class CreateUserDto {
  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public passwordHash: string,
    public readonly role: UserRole
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param props - Object containing the user fields
   * @returns A tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, CreateUserDto?] {
    const { firstName, lastName, email, password, role = "User" } = props;

    const error = this.validate({ firstName, lastName, email, password, role });
    if (error) return [error];

    return [
      undefined,
      new CreateUserDto(firstName, lastName, email, password, role as UserRole)
    ];
  }

  /**
   * Validates user properties
   * @param props - Object containing the user fields
   * @returns An error message or undefined if valid
   */
  private static validate(props: {
    firstName: any;
    lastName: any;
    email: any;
    password: any;
    role: any;
  }): string | undefined {
    const { firstName, lastName, email, password, role } = props;

    // First name validation
    if (firstName === undefined) return "Missing firstName";
    if (typeof firstName !== "string") return "First name must be a string";

    // Last name validation
    if (lastName === undefined) return "Missing lastName";
    if (typeof lastName !== "string") return "Last name must be a string";

    // Email validation
    if (email === undefined) return "Missing email";
    if (typeof email !== "string" || !regularExps.email.test(email)) {
      return "Email is not valid";
    }

    // Password validation
    if (password === undefined) return "Missing password";
    if (typeof password !== "string") return "Password must be a string";
    if (password.length < 6) return "Password too short";

    // Role validation
    if (role === undefined) return "Missing role";
    if (typeof role !== "string") return "Role must be a string";
    if (!userRole.includes(role)) {
      return `Invalid role. Valid roles are: ${userRole}`;
    }

    return undefined; // No validation errors
  }
}

