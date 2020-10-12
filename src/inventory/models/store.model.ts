import sequelize from './sequelize';
const { DataTypes } = require('sequelize');

export const Store = sequelize.define('store', {
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING
    }
});