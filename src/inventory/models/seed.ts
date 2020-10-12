import { Asset } from './asset.model';
import { Store } from './store.model';
import { StockStatus } from './stock-status.model';
import { Logger } from '@nestjs/common';

export const seed = async (force: boolean) => {
    await Asset.sync({force: force});
    await Store.sync({force: force});
    await StockStatus.sync({force: force});
    Logger.log('Models synced');

    // Seed with sample data, for the sake of the test
    if (await Store.count() === 0) {
        await Store.create({'id': '1', 'name': 'Default Store'});
    }
    if (await Asset.count() === 0) {
        await Asset.create({'id': '1', 'name': 'iPhone X'});
        await Asset.create({'id': '2', 'name': 'Galaxy S9'});
        await Asset.create({'id': '3', 'name': 'Huwauei P20 Lite'});
        await Asset.create({'id': '4', 'name': 'Lenovo Thinkpad X1'});
    }
    if (await StockStatus.count() === 0) {
        await StockStatus.create({assetId: '1', storeId: '1', inStock: 100});
        await StockStatus.create({assetId: '2', storeId: '1', inStock: 100});
        await StockStatus.create({assetId: '3', storeId: '1', inStock: 100});
        await StockStatus.create({assetId: '4', storeId: '1', inStock: 100});
    }
    Logger.log('Models seeded');
}
