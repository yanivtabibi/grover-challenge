import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { HttpException, Logger } from '@nestjs/common';
import { CreateStoreCommand } from '../create-store.command';
import { StoreCreatedEvent } from '../../events/store-created.event';
import { Store } from '../../models/store.model';
import { StoreCreationFailedEvent } from '../../events/store-creation-failed.event';

@CommandHandler(CreateStoreCommand)
export class CreateStoreHandler
  implements ICommandHandler<CreateStoreCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateStoreCommand) {
    Logger.log('Async CreateStoreCommand...', 'CreateStoreCommand');

    try {
      await Store.create({
        id: command.store.storeId,
        name: command.store.name,
      })

      this.eventBus.publish(new StoreCreatedEvent(command.store));
      return {
        result: command.store
      }
    } catch(err) {
      this.eventBus.publish(new StoreCreationFailedEvent(err));
      throw new HttpException(err.errors || err.message, 422)
    }
  }
}
