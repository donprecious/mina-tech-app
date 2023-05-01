import { IEventbus, eventBusToken } from './ieventbus';
import { EventEmitter } from 'events';
import { Service } from 'typedi';

@Service()
export class EventBus extends EventEmitter implements IEventbus {
  // public static getInstance(): EventBus {
  //   if (!EventBus.instance) {
  //     EventBus.instance = new EventBus();
  //   }
  //   return EventBus.instance;
  // }

  // private static instance: EventBus;

  public constructor() {
    super();
  }

  public async publish(event: string, data: unknown) {
    await this.emit(event, data);
  }

  public async subscribe(event: string, listener: (...args: any[]) => void) {
    await this.on(event, listener);
  }
}
