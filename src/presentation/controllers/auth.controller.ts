import { LoginDto } from '../../application/user/model/users.dto';
import { BaseResponse } from '../../application/common/model/base.response';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@/domain/interfaces/auth.interface';
import { IUser } from '@/domain/interfaces/users.interface';
import { AuthService } from '@/application/auth/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const signUpUserData = await this.auth.signup(userData);
      res.setHeader('Set-Cookie', [signUpUserData.cookie]);
      res.status(201).json(BaseResponse.Success(signUpUserData.user));
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginDto = req.body;
      const loginResult = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [loginResult.cookie]);
      res.status(200).json(BaseResponse.Success(loginResult.user));
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
