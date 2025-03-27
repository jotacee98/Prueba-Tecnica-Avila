import { UserEntity } from "../../../src/core/entities/user.entity";
import { UserRole } from "../../../src/shared/types/user.type";

describe("UserEntity", () => {
  const dataObj = {
    id: 1,
    firstName: "Reinaldo",
    lastName: "Armas",
    email: "test@email.com",
    passwordHash: "123456*",
    emailValidated: false,
    role: "Administrator",
  };
  test("should create a UserEntity instance", () => {
    const user = new UserEntity(
      dataObj.id,
      dataObj.firstName,
      dataObj.lastName,
      dataObj.email,
      dataObj.passwordHash,
      dataObj.role as UserRole
    );

    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id).toBe(dataObj.id);
    expect(user.firstName).toBe(dataObj.firstName);
    expect(user.lastName).toBe(dataObj.lastName);
    expect(user.email).toBe(dataObj.email);
    expect(user.passwordHash).toBe(dataObj.passwordHash);
    expect(user.role).toBe(dataObj.role);
  });

  test("should create a UserEntity instance from object", () => {
    const user = UserEntity.fromObject(dataObj);

    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id).toBe(dataObj.id);
    expect(user.firstName).toBe(dataObj.firstName);
    expect(user.lastName).toBe(dataObj.lastName);
    expect(user.email).toBe(dataObj.email);
    expect(user.passwordHash).toBe(dataObj.passwordHash);
    expect(user.role).toBe(dataObj.role);
  });
});
