import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { StockReservedEvent } from '../stock-reserved.event';

@EventsHandler(StockReservedEvent)
export class StockReservedHandler
  implements IEventHandler<StockReservedEvent> {
  handle(event: StockReservedEvent) {
    Logger.log('StockReservredEvent');
  }
}
