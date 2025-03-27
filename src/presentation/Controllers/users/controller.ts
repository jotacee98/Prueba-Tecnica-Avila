import { Request, Response } from "express";
import { CreateUserDto } from "../../../core/dtos/users/create-user.dto";
import { UpdateUserDto } from "../../../core/dtos/users/update-user.dto";
import { CustomError } from "../../../core/errors/custom.error";
import { PaginationDto } from "../../../shared/dtos/pagination.dto";
import { UserService } from "../../services";

export class UserController {
  constructor(private readonly usersService: UserService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  public getAllUsers = async (req: Request, res: Response): Promise<any> => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.usersService
      .getAllUsers(paginationDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public getUserById = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    this.usersService
      .getUserById(id)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public createUser = async (req: Request, res: Response): Promise<any> => {
    const [error, createUserDto] = CreateUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.usersService
      .createUser(createUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public updateUser = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const [error, updateUserDto] = UpdateUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.usersService
      .updateUser(id, updateUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public deleteUser = async (req: Request, res: Response): Promise<any> => {
    const id = +req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id" });

    this.usersService
      .deleteUser(id)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
