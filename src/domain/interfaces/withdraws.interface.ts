import { IAuditable } from './auditable.interface';
import { ITransaction } from './transaction.interface';
import { IUser } from './users.interface';
export interface IWithdraw extends IAuditable {
  referenceNo: string;
  amount: number;
  currencyCode: string;
  userId: string;
  user?: IUser;
  narration?: string;
  transactionId: string;
  transaction: ITransaction;
  providerResponse?: string;
}
