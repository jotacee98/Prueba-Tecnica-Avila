import { CreateUserDto } from "../../core/dtos/users/create-user.dto";
import { UpdateUserDto } from "../../core/dtos/users/update-user.dto";
import { CustomError } from "../../core/errors/custom.error";
import { UserRepository } from "../../core/repositories";
import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { bcryptAdapter } from "../../shared/plugins/bcrypt.adapter";

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async getAllUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, users] = await Promise.all([
        this.repository.count(),
        this.repository.getRange(paginationDto),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/users?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/users?page=${page - 1}&limit=${limit}` : null,
        data: users,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async getUserById(id: number) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw CustomError.notFound("User not found");
    }
    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    const exists = await this.repository.existsByEmail(createUserDto.email);

    if (exists) {
      throw CustomError.badRequest("User already exists");
    }

    try {
      createUserDto.passwordHash = bcryptAdapter.hash(
        createUserDto.passwordHash
      );
      const user = await this.repository.create(createUserDto);

      return user;
    } catch (error) {
      console.log(error);

      throw CustomError.internalServer();
    }
  }

  public async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const exists = await this.repository.existsById(id);
    if (!exists) {
      throw CustomError.notFound("User not found");
    }

    const userByEmailExists = await this.repository.existsByEmail(
      updateUserDto.email
    );
    if (userByEmailExists) {
      throw CustomError.badRequest(
        `Email ${updateUserDto.email} already exists`
      );
    }

    try {
      const product = await this.repository.updateById(id, updateUserDto);
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async deleteUser(id: number) {
    const exists = await this.repository.existsById(id);
    if (!exists) {
      throw CustomError.notFound(`User with id:${id} not found`);
    }

    try {
      const product = await this.repository.deleteById(id);
      return product;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
