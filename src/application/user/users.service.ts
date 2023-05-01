import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@/application/user/model/users.dto';
import { HttpException } from '@/application/exceptions/httpException';
import { IUser } from '@/domain/interfaces/users.interface';
import { UserModel } from '@/infrastructure/persistence/models/users.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<IUser[]> {
    const users: IUser[] = await UserModel.query().select().from('users');
    return users;
  }

  public async findUserById(userId: number): Promise<IUser> {
    const findUser: IUser = await UserModel.query().findById(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUser> {
    const findUser: IUser = await UserModel.query().select().from('users').where('email', '=', userData.email).first();
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await UserModel.query()
      .insert({ ...userData, password: hashedPassword })
      .into('users');

    return createUserData;
  }

  public async updateUser(userId: number, userData: IUser): Promise<IUser> {
    const findUser: IUser[] = await UserModel.query().select().from('users').where('id', '=', userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await UserModel.query()
      .update({ ...userData, password: hashedPassword })
      .where('id', '=', userId)
      .into('users');

    const updateUserData: IUser = await UserModel.query().select().from('users').where('id', '=', userId).first();
    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<IUser> {
    const findUser: IUser = await UserModel.query().select().from('users').where('id', '=', userId).first();
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserModel.query().delete().where('id', '=', userId).into('users');
    return findUser;
  }
}
