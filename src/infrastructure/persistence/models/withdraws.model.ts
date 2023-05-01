import { TransactionModel } from './transactions.model';
import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { Auditable } from '@/infrastructure/persistence/models/auditable';
import { IWithdraw } from '@/domain/interfaces/withdraws.interface';
import { resolveModel } from '@/utils/objectionResolver';
import { RelationMappings, RelationMappingsThunk, Model, ModelClassSpecifier } from 'objection';

export class WithdrawModel extends Auditable implements IWithdraw {
  static tableName = 'withdraws';
  referenceNo: string;
  amount: number;
  currencyCode: string;
  userId: string;
  user?: UserModel;
  narration?: string;
  transactionId: string;
  providerResponse?: string;
  transaction: TransactionModel;

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./users.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'withdraws.userId',
          to: 'users.id',
        },
      },
      transaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./transactions.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'withdraws.transactionId',
          to: 'transactions.id',
        },
      },
    };
  }

  setWithdraw(
    userId: string,
    amount: number,
    currencyCode: string,
    transactionId: string,
    referenceNo: string,
    narration?: string,
    providerResponse?: string,
  ) {
    this.userId = userId;
    this.amount = amount;
    this.currencyCode = currencyCode;
    this.transactionId = transactionId;
    this.referenceNo = referenceNo;
    this.narration = narration ?? '';
    this.providerResponse = providerResponse ?? '';
  }
}
