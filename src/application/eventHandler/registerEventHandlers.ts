import { Container } from 'typedi';

import { EventBus } from './eventbus';
import { eventBusToken, IEventbus } from './ieventbus';
import { WithdrawCreatedEventHandler } from './domainEventHandlers/withdrawCreatedEvent';
import { DepositCreatedHandler } from './domainEventHandlers/depositCreatedEvent';

export function registerEventHandlers() {
  const eventBus = Container.get<IEventbus>(eventBusToken);

  // Register your event handlers here
  const depositEventHandler = new DepositCreatedHandler();
  eventBus.subscribe(depositEventHandler.eventName, depositEventHandler.handle.bind(depositEventHandler));

  const withdrawalEventHandler = new WithdrawCreatedEventHandler();
  eventBus.subscribe(withdrawalEventHandler.eventName, withdrawalEventHandler.handle.bind(withdrawalEventHandler));
}
