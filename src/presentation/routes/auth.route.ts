import { LoginDto } from '../../application/user/model/users.dto';
import { Router } from 'express';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { CreateUserDto } from '@/application/user/model/users.dto';
import { Routes } from '@/domain/interfaces/routes.interface';
import { AuthMiddleware } from '@/presentation/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/presentation/middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/api/v1/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginDto), this.auth.logIn);
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.auth.logOut);
  }
}
