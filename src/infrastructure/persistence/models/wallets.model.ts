import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { IWallet } from '../../../domain/interfaces/wallets.interface';
import { Auditable } from '@/infrastructure/persistence/models/auditable';
import { resolveModel } from '@/utils/objectionResolver';
import { RelationMappings, RelationMappingsThunk, Model, ModelClassSpecifier } from 'objection';
export class WalletModel extends Auditable implements IWallet {
  static tableName = 'wallets';

  userId: string;
  user: UserModel;
  amount: number;
  currencyCode: string;

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: resolveModel(import('./users.model')) as unknown as ModelClassSpecifier,
        join: {
          from: 'wallets.userId',
          to: 'users.id',
        },
      },
    };
  }
}
