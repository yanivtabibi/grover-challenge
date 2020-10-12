import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { StoreCreatedEvent } from '../store-created.event';

@EventsHandler(StoreCreatedEvent)
export class StoreCreatedHandler
  implements IEventHandler<StoreCreatedEvent> {
  handle(event: StoreCreatedEvent) {
    Logger.log(event, 'StoreCreatedEvent');
  }
}
