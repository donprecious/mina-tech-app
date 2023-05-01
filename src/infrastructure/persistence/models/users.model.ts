import { Model, ModelObject } from 'objection';
import { IUser } from '@/domain/interfaces/users.interface';
import { v4 as uuidv4 } from 'uuid';
export class UserModel extends Model implements IUser {
  id!: string;
  email!: string;
  password!: string;
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;

  static tableName = 'users'; // database table name
  static idColumn = 'id'; // id column name
  $beforeInsert() {
    this.id = uuidv4();
  }
}

export type UserShape = ModelObject<UserModel>;
