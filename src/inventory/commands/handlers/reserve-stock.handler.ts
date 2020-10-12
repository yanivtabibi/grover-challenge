import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { ReserveStockCommand } from '../reserve-stock.command';
import { HttpException, Logger } from '@nestjs/common';
import { StockReservedEvent } from '../../events/stock-reserved.event';
import { StockReservationRequestedEvent } from '../../events/stock-reservation-requested.event';
import sequelize from '../../models/sequelize';
import { StockStatus } from '../../models/stock-status.model';
import { StockReservationRejectedEvent } from '../../events/stock-reservation-rejected.event';
import { StockReservationRequest } from '../../dto/stock-reservation-request';

@CommandHandler(ReserveStockCommand)
export class ReserveStockHandler
  implements ICommandHandler<ReserveStockCommand> {

  private transaction;

  constructor(
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReserveStockCommand) {
    Logger.log('Stock Reservation Requested', 'ReserveStockCommand');
    this.eventBus.publish(new StockReservationRequestedEvent(command.reservation));

    if (!command.reservation.assets || command.reservation.assets.length === 0) {
      this.reject(`asset array is required`, command.reservation);
    }
    const storeId = command.reservation.storeId || '1';
    this.transaction = await sequelize.transaction({ autocommit: false });
    for (const asset of command.reservation.assets) {

      // Validation
      if (!asset.assetId) {
        this.reject(`asset.assetId is required`, command.reservation);
      }
      if (typeof asset.assetId !== 'string') {
        this.reject(`asset.assetId should be of type string`, command.reservation);
      }
      if (!asset.quantity) {
        this.reject(`asset.quantity is required`, command.reservation);
      }
      if (typeof asset.quantity !== 'number') {
        this.reject(`asset.quantity should be of type number`, command.reservation);
      }

      // Query existing stock status with transaction lock
      const status = await StockStatus.findOne({
        where: {
          storeId: storeId,
          assetId: asset.assetId
        },
        transaction: this.transaction,
        lock: true
      });

      // Handle insufficient stock - Rollback Transaction
      if (!status || (status.inStock < asset.quantity)) {
        this.reject(status ?
            `Not enough items in stock for ${asset.assetId}` :
            `Asset ${asset.assetId} Does not exist in store ${storeId}`, command.reservation);
      }

      // Reserve the stock and decrease amount in DB, return to user
      await StockStatus.decrement('"inStock"', {
        by: asset.quantity,
        where: {
          storeId: storeId,
          assetId: asset.assetId
        },
        transaction: this.transaction
      });
    }

    this.eventBus.publish(new StockReservedEvent(command.reservation));
    Logger.log('Stock Reservation Confirmed', 'ReserveStockCommand');
    this.transaction.commit();
    return {
      reserved: command.reservation
    }
  }

  private reject(reason: string, reservation: StockReservationRequest) {
    this.eventBus.publish(new StockReservationRejectedEvent(reservation));
    Logger.log('Stock Reservation Rejected', 'ReserveStockCommand');
    if (this.transaction) {
      this.transaction.rollback();
    }
    throw new HttpException(reason, 422);
  }
}
