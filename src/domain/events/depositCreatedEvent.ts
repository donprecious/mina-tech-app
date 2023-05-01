import { IDeposit } from './../interfaces/deposit.interface';
import { ITransaction } from './../interfaces/transaction.interface';
import { DomainEvent } from './domainEvent';
export class DepositCreatedEvent extends DomainEvent {
  public static eventName = 'depositCreatedEvent';
  constructor(public readonly Transaction: ITransaction) {
    super();
  }
}
