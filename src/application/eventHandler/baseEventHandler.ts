import { DomainEvent } from '@/domain/events/domainEvent';
import { logger } from '@/utils/logger';

export abstract class BaseEventHandler {
  abstract eventName: string;

  handle(data: DomainEvent): void {
    logger.log(`${this.eventName} event received:`, data);
  }
}
