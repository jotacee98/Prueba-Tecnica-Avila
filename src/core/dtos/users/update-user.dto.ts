import { regularExps } from "../../../shared/regular-expressions/regular-exp";
import { UserRole, userRole } from "../../../shared/types/user.type";

export class UpdateUserDto {
  constructor(public role: UserRole, public email: string) {}

  static create(props: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { role, email } = props;

    if (!role) return ["Missing role"];
    if (!userRole.includes(role))
      return [`Invalid role. Valid roles are ${userRole}`];

    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];

    return [undefined, new UpdateUserDto(role, email)];
  }
}
