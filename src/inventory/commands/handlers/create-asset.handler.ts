import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { HttpException, Logger } from '@nestjs/common';
import { Asset } from '../../models/asset.model';
import { CreateAssetCommand } from '../create-asset.command';
import { AssetCreatedEvent } from '../../events/asset-created.event';
import { AssetCreationFailedEvent } from '../../events/asset-creation-failed.event';

@CommandHandler(CreateAssetCommand)
export class CreateAssetHandler
  implements ICommandHandler<CreateAssetCommand> {
  constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateAssetCommand) {
    Logger.log('Async CreateStoreCommand...', 'CreateStoreCommand');

    try {
      await Asset.create({
        id: command.asset.assetId,
        name: command.asset.name,
      })

      this.eventBus.publish(new AssetCreatedEvent(command.asset));
      return {
        result: command.asset
      }
    } catch(err) {
      this.eventBus.publish(new AssetCreationFailedEvent(err));
      throw new HttpException(err.errors || err.message, 422)
    }
  }
}
