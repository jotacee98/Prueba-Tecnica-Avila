import { UserDatasource } from "../../core/sources";
import { CreateUserDto } from "../../core/dtos/users/create-user.dto";
import { UpdateUserEmailValidatedDto } from "../../core/dtos/users/update-user-email-validated.dto";
import { UpdateUserDto } from "../../core/dtos/users/update-user.dto";
import { UserEntity } from "../../core/entities";
import { UserRepository } from "../../core/repositories";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}
  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.datasource.create(createUserDto);
  }
  getAll(): Promise<UserEntity[]> {
    return this.datasource.getAll();
  }
  findById(id: number): Promise<UserEntity | null> {
    return this.datasource.findById(id);
  }
  updateById(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.datasource.updateById(id, updateUserDto);
  }

  deleteById(id: number): Promise<string> {
    return this.datasource.deleteById(id);
  }

  count(): Promise<number> {
    return this.datasource.count();
  }

  getRange(paginationDto: PaginationDto): Promise<UserEntity[]> {
    return this.datasource.getRange(paginationDto);
  }

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.datasource.getByEmail(email);
  }

  existsById(id: number): Promise<boolean> {
    return this.datasource.existsById(id);
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.datasource.existsByEmail(email);
  }

  existsByEmailExcludingId(id: number, email: string): Promise<boolean> {
    return this.datasource.existsByEmailExcludingId(id, email);
  }
}
