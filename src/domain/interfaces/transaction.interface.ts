import { IDeposit } from './deposit.interface';
import { IWithdraw } from './withdraws.interface';
import { IUser } from '@/domain/interfaces/users.interface';
import { TransactionCategoryEnum } from '../enums/transactionEnums';
import { TransactionTypeEnum } from '@/domain/enums/transactionEnums';
import { IAuditable } from './auditable.interface';

export interface ITransaction extends IAuditable {
  referenceNo: string;
  amount: number;
  currencyCode: string;
  transactionType: TransactionTypeEnum;
  userId: string;
  user?: IUser;
  transactionCategory: TransactionCategoryEnum;
  narration?: string;

  withdraw: IWithdraw;
  deposit: IDeposit;
}
