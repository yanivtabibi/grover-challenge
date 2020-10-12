import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service';
import { StockReservationRequest } from '../dto/stock-reservation-request';
import { Store } from '../dto/store';
import { Asset } from '../dto/asset';
import { GetStoresQuery } from '../queries/get-stores.query';
import { GetAssetsQuery } from '../queries/get-assets.query';

@Controller('inventory')
@ApiTags('Inventory')
export class InventoryController {
  constructor(
      private readonly inventoryService: InventoryService,
      private readonly queryBus: QueryBus
  ) { }


  /* Get Stores */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Get Stores' })
  @ApiResponse({ status: 200, description: 'Get Stores' })
  @Get('/stores/')
  async getStores(): Promise<Store[]> {
    return this.queryBus.execute(new GetStoresQuery(null));
  }

  /* Get Store */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Get Store' })
  @ApiResponse({ status: 200, description: 'Get Store' })
  @Get('/stores/:storeId')
  async getStore(@Param() params): Promise<Store[]> {
    return this.queryBus.execute(new GetStoresQuery(params.storeId));
  }

  /* Get Assets */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Get Assets' })
  @ApiResponse({ status: 200, description: 'Get Assets' })
  @Get('/assets/')
  async getAssets(): Promise<Asset[]> {
    return this.queryBus.execute(new GetAssetsQuery(null));
  }

  /* Get Asset */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Get Asset' })
  @ApiResponse({ status: 200, description: 'Get Asset' })
  @Get('/assets/:assetId')
  async getAsset(@Param() params): Promise<Asset[]> {
    return this.queryBus.execute(new GetAssetsQuery(params.assetId));
  }

  /* Reserve Stock */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Request a stock reservation for a specific list of assets, from a specific store' })
  @ApiResponse({ status: 200, description: 'Reserve Stock.' })
  @Post('/reserve')
  async reserveStock(@Body() reservation: StockReservationRequest): Promise<StockReservationRequest> {
    return this.inventoryService.reserveStock(reservation);
  }

  /* Add Stock */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Add stock for a specific asset, from a specific store' })
  @ApiResponse({ status: 200, description: 'Replenish Stock.' })
  @Post('/add')
  async addStock(@Body() reservation: StockReservationRequest): Promise<StockReservationRequest> {
    //return this.inventoryService.addStock(reservation);
    return ;
  }

  /* Add Store */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Create a new store. ID should be a unique string' })
  @ApiResponse({ status: 200, description: 'A new store was created' })
  @Post('/stores')
  async createStore(@Body() store: Store): Promise<Store> {
    return this.inventoryService.createStore(store);
  }

  /* Add Asset */
  /*--------------------------------------------*/
  @ApiOperation({ summary: 'Create a new asset. ID should be a unique string' })
  @ApiResponse({ status: 200, description: 'Create a new asset' })
  @Post('/assets')
  async createAsset(@Body() asset: Asset): Promise<StockReservationRequest> {
    return this.inventoryService.createAsset(asset);
  }
}
