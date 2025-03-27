import { UserRole } from "../../shared/types/user.type";

export class UserEntity {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole
  ) {}

  public static fromObject(object: { [key: string]: any }): UserEntity {
    const {
      id,
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    } = object;

    const user = new UserEntity(
      id,
      firstName,
      lastName,
      email,
      passwordHash,
      role as UserRole
    );

    return user;
  }
}
