import { logger } from '@utils/logger';
import { Container } from 'typedi';
import { EventBus } from './eventHandler/eventbus';
import { eventBusToken } from './eventHandler/ieventbus';

export const SetupApplicationDependency = () => {
  try {
    const eventBus = Container.get(EventBus);
    Container.set(eventBusToken, eventBus);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
