import { Module, OnModuleInit } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { EventStoreModule } from '@juicycleff/nestjs-event-store';
import { config } from '../config';


@Module({
  imports: [
    EventStoreModule.register({
      type: 'event-store',
      tcpEndpoint: {
        host: config.ES.HOST,
        port: config.ES.PORT,
      },
      options: {
        defaultUserCredentials: {
          username: config.ES.USER,
          password: config.ES.PASS,
        },
      },
    }),
    InventoryModule,
  ],
})

export class AppModule {}
