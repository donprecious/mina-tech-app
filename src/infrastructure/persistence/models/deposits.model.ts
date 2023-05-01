import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { TransactionModel } from './transactions.model';
import { IDeposit } from '../../../domain/interfaces/deposit.interface';
import { Auditable } from '@/infrastructure/persistence/models/auditable';
import { resolveModel } from '@/utils/objectionResolver';
import { RelationMappings, RelationMappingsThunk, Model, ModelClassSpecifier } from 'objection';

export class DepositModel extends Auditable implements IDeposit {
  static tableName = 'deposits';

  referenceNo: string;
  amount: number;
  currencyCode: string;
  userId: string;
  user?: UserModel;
  narration?: string;
  transactionId: string;
  transaction: TransactionModel;
  providerResponse?: string;

  setDeposit(
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

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./users.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'deposits.userId',
          to: 'users.id',
        },
      },
      transaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./transactions.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'deposits.transactionId',
          to: 'transactions.id',
        },
      },
    };
  }
}
