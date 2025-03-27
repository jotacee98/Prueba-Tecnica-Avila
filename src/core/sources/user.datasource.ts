import { PaginationDto } from "../../shared/dtos/pagination.dto";
import { CreateUserDto } from "../dtos/users/create-user.dto";
import { UserEntity } from "../entities";
import { UpdateUserDto } from "../dtos/users/update-user.dto";

export abstract class UserDatasource {
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;

  abstract getAll(): Promise<UserEntity[]>;

  abstract findById(id: number): Promise<UserEntity | null>;

  abstract updateById(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity>;

  abstract deleteById(id: number): Promise<string>;

  abstract count(): Promise<number>;

  abstract getRange(paginationDto: PaginationDto): Promise<UserEntity[]>;

  abstract getByEmail(email: string): Promise<UserEntity | null>;

  abstract existsById(id: number): Promise<boolean>;

  abstract existsByEmail(email: string): Promise<boolean>;

  abstract existsByEmailExcludingId(
    id: number,
    email: string
  ): Promise<boolean>;
}
