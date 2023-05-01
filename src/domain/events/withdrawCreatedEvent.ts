import { IWithdraw } from './../interfaces/withdraws.interface';

import { ITransaction } from '../interfaces/transaction.interface';
import { DomainEvent } from './domainEvent';
export class WithdrawCreatedEvent extends DomainEvent {
  public static eventName = 'withdrawCreatedEvent';
  constructor(public readonly Transaction: ITransaction) {
    super();
  }
}
