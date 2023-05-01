import { Auditable } from '@/infrastructure/persistence/models/auditable';
import { IBankAccounts } from '@/domain/interfaces/bankaccounts.interface';
import { UserModel } from './users.model';
import { resolveModel } from '@/utils/objectionResolver';
import { RelationMappings, RelationMappingsThunk, Model, ModelClassSpecifier } from 'objection';

export class BankAccountModel extends Auditable implements IBankAccounts {
  static tableName = 'bankAccounts';

  userId: string;
  user?: UserModel;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  isVirtual: boolean;
  isTemporary: boolean;
  currencyCode: string;
  requestedAmount?: number;
  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./users.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'bankAccounts.userId',
          to: 'users.id',
        },
      },
    };
  }

  setBankAccount(
    userId: string,
    accountNumber: string,
    accountName: string,
    bankName: string,

    currencyCode: string,
    isVirtual?: boolean,

    isTemporary?: boolean,
    bankCode?: string,
  ) {
    this.userId = userId;
    this.accountNumber = accountNumber;
    this.accountName = accountName;
    this.bankName = bankName;
    this.bankCode = bankCode;
    this.currencyCode = currencyCode;
    this.bankCode = bankCode ?? '';
    this.isVirtual = isVirtual ?? false;
    this.isTemporary = isTemporary ?? false;
  }
  /**
   *
   */
}
