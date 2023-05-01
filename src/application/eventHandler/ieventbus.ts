import { DomainEvent } from '@/domain/events/domainEvent';
import { EventBus } from './eventbus';

export interface IEventbus {
  publish(event: string, data: DomainEvent);

  subscribe(event: string, listener: (...args: any[]) => void);
}

export const eventBusToken = 'eventbus.token';
