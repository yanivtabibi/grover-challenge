import { CqrsModule } from '@nestjs/cqrs';
import { Module, OnModuleInit } from '@nestjs/common';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { QueryHandlers } from './queries/handlers';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { EventStoreModule, EventStoreSubscriptionType } from '@juicycleff/nestjs-event-store';
import { StoreCreatedEvent } from './events/store-created.event';
import { StoreCreationFailedEvent } from './events/store-creation-failed.event';
import { AssetCreationFailedEvent } from './events/asset-creation-failed.event';
import { AssetCreatedEvent } from './events/asset-created.event';
import { StockReservationRequestedEvent } from './events/stock-reservation-requested.event';
import { StockReservationRejectedEvent } from './events/stock-reservation-rejected.event';
import { StockReservedEvent } from './events/stock-reserved.event';
import { seed } from './models/seed';

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      featureStreamName: '$ce-inventory',
      type: 'event-store',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.CatchUp,
          stream: '$ce-inventory',
        },
      ],
      eventHandlers: {
        StoreCreatedEvent: (data) => new StoreCreatedEvent(data),
        StoreCreationFailedEvent: (data) => new StoreCreationFailedEvent(data),
        AssetCreatedEvent: (data) => new AssetCreatedEvent(data),
        AssetCreationFailedEvent: (data) => new AssetCreationFailedEvent(data),
        StockReservationRequestedEvent: (data) => new StockReservationRequestedEvent(data),
        StockReservationRejectedEvent: (data) => new StockReservationRejectedEvent(data),
        StockReservedEvent: (data) => new StockReservedEvent(data),
      },
    }),
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers
  ],
})

export class InventoryModule implements OnModuleInit {
  async onModuleInit() {
    await seed(false);
  }
}

