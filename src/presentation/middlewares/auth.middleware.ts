import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@/application/exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@/domain/interfaces/auth.interface';
import { IUser } from '@/domain/interfaces/users.interface';
import { UserModel } from '@/infrastructure/persistence/models/users.model';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const verificationResponse = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      const { id } = verificationResponse;
      const findUser: IUser = await UserModel.query().findById(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
