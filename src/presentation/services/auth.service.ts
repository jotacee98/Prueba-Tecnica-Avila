import { envs } from "../../config/envs";
import { LoginUserDto } from "../../core/dtos/auth/login-user.dto";
import { CreateUserDto } from "../../core/dtos/users/create-user.dto";

import { UserEntity } from "../../core/entities";
import { CustomError } from "../../core/errors/custom.error";
import { UserRepository } from "../../core/repositories";
import { bcryptAdapter } from "../../shared/plugins/bcrypt.adapter";
import { JwtAdapter } from "../../shared/plugins/jwt.adapter";

export class AuthService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  public async login(loginUserDto: LoginUserDto) {
    // Verify if user exists
    const user = await this.repository.getByEmail(loginUserDto.email);
    if (!user)
      throw CustomError.badRequest(
        `User with email ${loginUserDto.email} was not found`
      );
    //isMatch...bcrypt...compare(123456,hash)
    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.passwordHash
    );
    if (!isMatching)
      throw CustomError.badRequest("Password is not correct. Please try again");

    const { passwordHash, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
      email: user.email,
    });
    if (!token) throw CustomError.internalServer("Error while creating JWT");
    return {
      user: userEntity,
      token: token,
    };
  }

  public async register(createUserDto: CreateUserDto) {
    const existUser = await this.repository.getByEmail(createUserDto.email);
    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      createUserDto.passwordHash = bcryptAdapter.hash(
        createUserDto.passwordHash
      );

      const user = await this.repository.create(createUserDto);

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
