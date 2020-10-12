import { IEvent } from '@nestjs/cqrs';
import { Store } from '../dto/store';

export class StoreCreatedEvent implements IEvent {
  constructor(
    public readonly store: Store) {}
}
