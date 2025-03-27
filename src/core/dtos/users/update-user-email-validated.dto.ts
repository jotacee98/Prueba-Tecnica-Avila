import { regularExps } from "../../../shared/regular-expressions/regular-exp";

export class UpdateUserEmailValidatedDto {
  constructor(public email: string, public emailValidated: boolean) {}

  static create(props: {
    [key: string]: any;
  }): [string?, UpdateUserEmailValidatedDto?] {
    const { email, emailValidated } = props;

    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];

    if (!emailValidated) return ["Missing emailValidated"];
    if (!(typeof emailValidated === "boolean"))
      ["emailValidated property must be a boolean"];

    return [undefined, new UpdateUserEmailValidatedDto(email, emailValidated)];
  }
}
