import { IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Store {
    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly storeId!: string;

    @IsDefined()
    @IsString()
    @ApiProperty()
    readonly name!: string;
}