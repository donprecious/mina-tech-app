import { IUser } from '@/domain/interfaces/users.interface';
import { IAuditable } from './auditable.interface';
export interface IWallet extends IAuditable {
  userId: string;
  user: IUser;
  amount: number;
  currencyCode: string;
}
