import { GetAuthUserDto, LoginDto } from '../user/model/users.dto';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { HttpException } from '@/application/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@/domain/interfaces/auth.interface';
import { IUser } from '@/domain/interfaces/users.interface';
import { UserModel } from '@/infrastructure/persistence/models/users.model';

const createToken = (user: IUser): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: IUser): Promise<{ cookie: string; user: GetAuthUserDto }> {
    const findUser: IUser = await UserModel.query().select().from('users').where('email', '=', userData.email).first();
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await UserModel.query()
      .insert({ ...userData, password: hashedPassword })
      .into('users');

    const tokenData = createToken(createUserData);
    const cookie = createCookie(tokenData);
    const user: GetAuthUserDto = {
      authToken: tokenData.token,
      tokenExpiry: tokenData.expiresIn,
      email: createUserData.email,
    };
    return { cookie, user };
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; user: GetAuthUserDto }> {
    const findUser: IUser = await UserModel.query().select().from('users').where('email', '=', userData.email).first();
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);
    const user: GetAuthUserDto = {
      authToken: tokenData.token,
      tokenExpiry: tokenData.expiresIn,
      email: userData.email,
    };
    return { cookie, user };
  }

  public async logout(userData: IUser): Promise<IUser> {
    const findUser: IUser = await UserModel.query()
      .select()
      .from('users')
      .where('email', '=', userData.email)
      .andWhere('password', '=', userData.password)
      .first();

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
