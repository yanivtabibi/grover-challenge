import { config } from '../../../config'
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    config.POSTGRES.DB,
    config.POSTGRES.USER,
    config.POSTGRES.PASS,
    {
        host: 'localhost',
        dialect: 'postgres',
        port: config.POSTGRES.PORT,
        logging: config.POSTGRES.LOGGING
    }
);

export default sequelize;
