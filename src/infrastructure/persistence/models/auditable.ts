import { Model } from 'objection';
import { IAuditable } from '../../../domain/interfaces/auditable.interface';
import { v4 as uuidv4 } from 'uuid';
export class Auditable extends Model implements IAuditable {
  id: string;
  createdAt: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted: boolean;

  $beforeInsert() {
    this.id = this.id || uuidv4();
  }
}
