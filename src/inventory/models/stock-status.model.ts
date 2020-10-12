import sequelize from './sequelize';
import { Store } from './store.model';
import { Asset } from './asset.model';
const { DataTypes } = require('sequelize');

export const StockStatus = sequelize.define('stock_status', {
    // Model attributes are defined here
    storeId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    assetId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    inStock: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'stock_status'
});

StockStatus.belongsTo(Store);
StockStatus.belongsTo(Asset);