import { regularExps } from "../../../shared/regular-expressions/regular-exp";
import { UserRole, userRole } from "../../../shared/types/user.type";

export class AuthUserDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly role: UserRole
  ) {}

  /**
   * Static method to create a DTO with validation
   * @param props - object containing the user properties
   * @returns a tuple [error?, dto?]
   */
  static create(props: { [key: string]: any }): [string?, AuthUserDto?] {
    const { id, email, role } = props;

    const error = this.validate(id, email, role);
    if (error) return [error];

    return [undefined, new AuthUserDto(id, email, role as UserRole)];
  }

  /**
   * Validates the user properties
   * @param id - User ID
   * @param email - User email
   * @param role - User role
   * @returns An error message or undefined if valid
   */
  private static validate(
    id: any,
    email: any,
    role: any
  ): string | undefined {
    // ID validation
    if (typeof id !== "number" || isNaN(id) || id < 0) {
      return "Invalid or missing id. ID must be a positive number";
    }

    // Email validation
    if (!email || typeof email !== "string" || !regularExps.email.test(email)) {
      return "Invalid or missing email";
    }

    // Role validation
    if (!role || !userRole.includes(role)) {
      return `Invalid role. Valid roles are: ${userRole.join(", ")}`;
    }

    return undefined; // No errors
  }
}

