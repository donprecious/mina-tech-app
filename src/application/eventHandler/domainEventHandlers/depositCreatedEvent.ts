import { logger } from '@utils/logger';
import { DepositCreatedEvent } from '@/domain/events/depositCreatedEvent';
import { IDeposit } from '@/domain/interfaces/deposit.interface';
import { ITransaction } from '@/domain/interfaces/transaction.interface';
import { BaseEventHandler } from '../baseEventHandler';

export class DepositCreatedHandler extends BaseEventHandler {
  eventName = DepositCreatedEvent.eventName;
  handle(depositEvent: DepositCreatedEvent): void {
    // Perform your custom logic here

    super.handle(depositEvent.Transaction);
    logger.info('depositCreated Event received: ' + JSON.stringify(depositEvent));
    //todo publish email notification to customer
  }
}
