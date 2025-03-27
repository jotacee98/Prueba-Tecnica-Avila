import { prisma } from "../../data/postgres";
import { UserDatasource } from "../../core/sources";
import { CreateUserDto } from "../../core/dtos/users/create-user.dto";
import { UpdateUserDto } from "../../core/dtos/users/update-user.dto";
import { UserEntity } from "../../core/entities";
import { PaginationDto } from "../../shared/dtos/pagination.dto";

export class UserDatasourceImpl implements UserDatasource {
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const product = await prisma.user.create({
      data: createUserDto,
    });

    return UserEntity.fromObject(product);
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();

    return users.map((user) => UserEntity.fromObject(user));
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return UserEntity.fromObject(user);
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return UserEntity.fromObject(user);
  }



  async deleteById(id: number): Promise<string> {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    return `User with id ${user.id} deleted`;
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }

  async getRange(paginationDto: PaginationDto): Promise<UserEntity[]> {
    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;

    const users = await prisma.user.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });

    return users.map((user) => UserEntity.fromObject(user));
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return UserEntity.fromObject(user);
  }

  async existsById(id: number): Promise<boolean> {
    return Boolean(
      await prisma.user.findUnique({
        where: {
          id,
        },
      })
    );
  }

  async existsByEmail(email: string): Promise<boolean> {
    return Boolean(
      await prisma.user.findUnique({
        where: {
          email,
        },
      })
    );
  }

  async existsByEmailExcludingId(id: number, email: string): Promise<boolean> {
    return Boolean(
      await prisma.user.findFirst({
        where: {
          id: {
            not: id,
          },
          email,
        },
      })
    );
  }
}
