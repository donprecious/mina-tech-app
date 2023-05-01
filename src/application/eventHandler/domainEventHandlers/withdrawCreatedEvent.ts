import { WithdrawCreatedEvent } from '@/domain/events/withdrawCreatedEvent';
import { IDeposit } from '@/domain/interfaces/deposit.interface';
import { ITransaction } from '@/domain/interfaces/transaction.interface';
import { logger } from '@/utils/logger';
import { BaseEventHandler } from '../baseEventHandler';

export class WithdrawCreatedEventHandler extends BaseEventHandler {
  eventName = WithdrawCreatedEvent.eventName;
  handle(transaction: ITransaction): void {
    // Perform your custom logic here

    super.handle(transaction);
    logger.info('withdrawal Event received: ' + JSON.stringify(transaction.withdraw));
    //todo publish email notification to customer
  }
}
