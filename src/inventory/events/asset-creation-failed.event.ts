import { IEvent } from '@nestjs/cqrs';
import { Asset } from '../dto/asset';

export class AssetCreationFailedEvent implements IEvent {
  constructor(
    public readonly asset: Asset) {}
}
