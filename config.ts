require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const env = process.env.NODE_ENV;
const configs = {
  base: {
    ENV: env,
    NAME: process.env.APP_NAME || 'Inventory',
    TITLE: process.env.APP_TITLE || 'Inventory Service',
    DESCRIPTION: process.env.APP_DESCRIPTION || 'Inventory API Microservice',
    PREFIX: process.env.APP_PREFIX || 'v1',
    VERSION: process.env.APP_VERSION || '1.0',
    API_EXPLORER_PATH: process.env.APP_API_EXPLORER_PATH || '/api',
    HOST: process.env.APP_HOST || '0.0.0.0',
    PORT: process.env.APP_PORT || 7070,
    POSTGRES: {
      DB: process.env.POSTGRES_DB || 'postgres',
      USER: process.env.POSTGRES_USER || 'postgres',
      PASS: process.env.POSTGRES_PASS || 'secret',
      PORT: process.env.POSTGRES_PORT || 5432,
      LOGGING: !!process.env.POSTGRES_LOGGING,
    },
    ES: {
      HOST: process.env.ES_HOST || 'localhost',
      PORT: process.env.ES_PORT || 1113,
      USER: process.env.ES_USER || 'admin',
      PASS: process.env.ES_PASS || 'changeit',
    }
  }
};
const config = {...configs.base, ...configs[env]};

export {config};
