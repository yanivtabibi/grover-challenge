import { IsString, IsDefined, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssetStockAmount {
    @ApiProperty()
    assetId!: string;

    @ApiProperty()
    quantity: number;
}

export class StockReservationRequest {
    @IsString()
    @ApiProperty()
    readonly userId: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly storeId!: string;

    @ApiProperty({ type: [AssetStockAmount] })
    @IsDefined()
    @ArrayNotEmpty()
    readonly assets: AssetStockAmount[];
}

