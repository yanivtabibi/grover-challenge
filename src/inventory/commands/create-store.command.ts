import { ICommand } from '@nestjs/cqrs';
import { Store } from '../dto/store';

export class CreateStoreCommand implements ICommand {
    constructor(
        public readonly store: Store,
    ) {}
}