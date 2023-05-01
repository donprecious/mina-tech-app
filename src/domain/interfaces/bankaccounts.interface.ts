import { IUser } from '@/domain/interfaces/users.interface';
import { IAuditable } from './auditable.interface';
export interface IBankAccounts extends IAuditable {
  userId: string;
  user?: IUser;
  accountNumber: string;
  accountName: string;
  currencyCode: string;
  bankName: string;
  bankCode: string;
  isVirtual: boolean;
  isTemporary: boolean;
  requestedAmount?: number;
}
