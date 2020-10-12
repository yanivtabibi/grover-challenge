import { IEvent } from '@nestjs/cqrs';

export class StoreCreationFailedEvent implements IEvent {
  constructor(
    public readonly error: any
  ) {}
}
