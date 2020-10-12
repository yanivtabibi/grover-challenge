import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateStoreCommand } from '../commands/create-store.command';
import { ReserveStockCommand } from '../commands/reserve-stock.command';
import { CreateAssetCommand } from '../commands/create-asset.command';
import { Store } from '../dto/store';
import { Asset } from '../dto/asset';
import { StockReservationRequest } from '../dto/stock-reservation-request';

@Injectable()
export class InventoryService {
  constructor(private readonly commandBus: CommandBus) {}

  async reserveStock(reservation: StockReservationRequest) {
    return await this.commandBus.execute(
        new ReserveStockCommand(reservation),
    );
  }

  async createStore(store: Store) {
    return await this.commandBus.execute(
        new CreateStoreCommand(store),
    );
  }

  async createAsset(asset: Asset) {
    return await this.commandBus.execute(
        new CreateAssetCommand(asset),
    );
  }
}
