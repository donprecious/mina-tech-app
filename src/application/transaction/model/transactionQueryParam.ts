import { ITransaction } from './../../../domain/interfaces/transaction.interface';
import { TransactionTypeEnum, TransactionCategoryEnum } from '@/domain/enums/transactionEnums';

export class TransactionQueryParam {
  transactionType?: TransactionTypeEnum;
  category?: TransactionCategoryEnum;
  userId = '';
  search = '';
  page = 0;
  limit = 10;

  constructor(partial: Partial<TransactionQueryParam>) {
    this.transactionType = partial.transactionType ?? null;
    this.category = partial.category ?? null;
    this.search = partial.search || '';
    this.userId = partial.userId || '';
    this.page = partial.page || 0;
    this.limit = partial.limit || 10;
  }
}

export class TransactionsPagingatedResult {
  items: ITransaction[];
  page: number;
  total: number;
  pageSize: number;
}
