import { IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Asset {
    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly assetId!: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly name!: string;
}