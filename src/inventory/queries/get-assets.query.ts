import { IQuery } from '@nestjs/cqrs';

export class GetAssetsQuery implements IQuery {
    constructor(
        public readonly assetId: string,
    ) {}
}
