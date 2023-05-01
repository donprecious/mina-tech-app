import { Router } from 'express';
import { UserController } from '@/presentation/controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@/application/user/model/users.dto';
import { Routes } from '@/domain/interfaces/routes.interface';
import { ValidationMiddleware } from '@/presentation/middlewares/validation.middleware';

export class UserRoute implements Routes {
  public path = '/api/v1/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateUserDto), this.user.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser);
  }
}
