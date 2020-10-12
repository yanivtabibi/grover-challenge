import { ICommand } from '@nestjs/cqrs';
import { Asset } from '../dto/asset';

export class CreateAssetCommand implements ICommand {
    constructor(
        public readonly asset: Asset,
    ) {}
}