import { IQuery } from '@nestjs/cqrs';

export class GetStoresQuery implements IQuery {
    constructor(
        public readonly storeId: string,
    ) {}
}