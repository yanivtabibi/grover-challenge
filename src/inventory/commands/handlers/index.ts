import { ReserveStockHandler } from './reserve-stock.handler';
import { CreateStoreHandler } from './create-store.handler';
import { CreateAssetHandler } from './create-asset.handler';

export const CommandHandlers = [
    ReserveStockHandler,
    CreateStoreHandler,
    CreateAssetHandler
];
