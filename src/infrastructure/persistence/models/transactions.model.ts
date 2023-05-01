import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { DepositModel } from './deposits.model';
import { WithdrawModel } from './withdraws.model';
import { Auditable } from '@/infrastructure/persistence/models/auditable';
import { TransactionTypeEnum, TransactionCategoryEnum } from '@/domain/enums/transactionEnums';
import { ITransaction } from '../../../domain/interfaces/transaction.interface';
import { Model, RelationMappings, RelationMappingsThunk } from 'objection';

import { v4 as uuidv4 } from 'uuid';
export class TransactionModel extends Auditable implements ITransaction {
  static tableName = 'transactions';

  referenceNo: string;
  amount: number;
  currencyCode: string;
  transactionType: TransactionTypeEnum;
  userId: string;
  user?: UserModel;
  transactionCategory: TransactionCategoryEnum;
  narration?: string;
  withdraw: WithdrawModel;
  deposit: DepositModel;

  setTransaction(
    userId: string,
    referenceNo: string,
    amount: number,
    currencyCode: string,
    transactionType: TransactionTypeEnum,
    transactionCategory: TransactionCategoryEnum,
    narration?: string,
    deposit?: DepositModel,
    withdraw?: WithdrawModel,
  ) {
    this.id = uuidv4();
    this.userId = userId;
    this.referenceNo = referenceNo;
    this.amount = amount;
    this.currencyCode = currencyCode;
    this.transactionType = transactionType;
    this.transactionCategory = transactionCategory;
    this.narration = narration;
    this.deposit = deposit ?? null;
    this.withdraw = withdraw ?? null;
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: () => require('./users.model').UserModel, //resolveModel(import('./users.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'transactions.userId',
          to: 'users.id',
        },
      },
      withdraw: {
        relation: Model.HasOneRelation,
        modelClass: () => require('./withdraws.model').WithdrawModel, // resolveModel(import('./withdraws.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'transactions.id',
          to: 'withdraws.transactionId',
        },
      },
      deposit: {
        relation: Model.HasOneRelation,
        modelClass: require('././deposits.model').DepositModel, // resolveModel(import('./deposits.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'transactions.id',
          to: 'deposits.transactionId',
        },
      },
    };
  }
}
