import { ICommand } from '@nestjs/cqrs';
import { StockReservationRequest } from '../dto/stock-reservation-request';

export class ReserveStockCommand implements ICommand {
    constructor(
        public readonly reservation: StockReservationRequest,
    ) {}
}