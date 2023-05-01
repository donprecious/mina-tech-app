import { TransactionCategoryEnum } from '@/domain/enums/transactionEnums';
import { ITransaction } from '@/domain/interfaces/transaction.interface';
import { DepositModelDto } from './model/depositModel';
import { TransactionQueryParam, TransactionsPagingatedResult } from './model/transactionQueryParam';

export interface ITransactionService {
  deposit(model: DepositModelDto): Promise<ITransaction>;

  debit(model: {
    userId: string;
    amount: number;
    currencyCode: string;
    referenceNo?: string;
    narration?: string;
    providerResponse?: string;
    category?: TransactionCategoryEnum;
  }): Promise<ITransaction>;

  handleTransferNotification(param: { referenceNo: string; isSuccess: boolean; payload?: string }): Promise<ITransaction>;

  getTransactions(param: TransactionQueryParam): Promise<TransactionsPagingatedResult>;
  getTransaction(id: string): Promise<ITransaction>;
}

export const transactionServiceToken = 'transaction.service.token';
