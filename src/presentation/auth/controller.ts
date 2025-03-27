import { Request, Response } from "express";
import { LoginUserDto } from "../../core/dtos/auth/login-user.dto";
import { CreateUserDto } from "../../core/dtos/users/create-user.dto";
import { CustomError } from "../../core/errors/custom.error";
import { AuthService } from "../services";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .login(loginDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public register = async (req: Request, res: Response): Promise<any> => {
    const [error, registerDto] = CreateUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .register(registerDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
