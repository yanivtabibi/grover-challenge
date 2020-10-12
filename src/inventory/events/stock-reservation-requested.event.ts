import { IEvent } from '@nestjs/cqrs';
import { StockReservationRequest } from '../dto/stock-reservation-request';

export class StockReservationRequestedEvent implements IEvent {
  constructor(
    public readonly reservation: StockReservationRequest) {}
}
