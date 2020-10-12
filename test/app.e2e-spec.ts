import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { seed } from '../src/inventory/models/seed';
import { StockStatus } from '../src/inventory/models/stock-status.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await seed(true);
  });

  it('Sanity - Get Assets', async (done) => {
    const response = await request(app.getHttpServer())
      .get('/inventory/assets');

    expect(response.status).toBe(200);
    done()
  });

  it('Sanity - Get Stores', async (done) => {
    const response = await request(app.getHttpServer())
        .get('/inventory/stores');

    expect(response.status).toBe(200);
    const result = JSON.parse(response.text);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Default Store');
    done()
  });

  it('Reservation - Wrong Data Types', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: 1,
              quantity: 20
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('asset.assetId should be of type string');
    done()
  });

  it('Reservation - Wrong Data Types', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
              quantity: '20'
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('asset.quantity should be of type number');
    done()
  });

  it('Reservation - Missing Data Types', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('asset.quantity is required');
    done()
  });

  it('Reservation - Missing Data Types', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('asset.assetId is required');
    done()
  });

  it('Reservation - Non Existing Asset', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1213',
              quantity: 20
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toEqual('Asset 1213 Does not exist in store 1');
    done()
  });

  it('Reservation - Happy Path', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
              quantity: 20
            }
          ]
        });

    expect(response.status).toBe(201);
    const result = JSON.parse(response.text);
    expect(result.reserved.assets).toEqual([
      {
        assetId: '1',
        quantity: 20
      }
    ]);
    done()
  });

  it('Reservation - Happy Path - Multiple Assets', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
              quantity: 20
            },
            {
              assetId: '2',
              quantity: 20
            },
            {
              assetId: '3',
              quantity: 20
            },
            {
              assetId: '4',
              quantity: 20
            }
          ]
        });

    expect(response.status).toBe(201);
    const result = JSON.parse(response.text);
    expect(result.reserved.assets).toEqual([
      {
        assetId: '1',
        quantity: 20
      },
      {
        assetId: '2',
        quantity: 20
      },
      {
        assetId: '3',
        quantity: 20
      },
      {
        assetId: '4',
        quantity: 20
      }
    ]);
    done()
  });

  it('Reservation - Rejected - Not In Stock', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
              quantity: 200
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('Not enough items in stock for 1');
    done()
  });

  it('Reservation - Transaction - Only first Asset in stock - Check that nothing was reserved', async (done) => {
    const response = await request(app.getHttpServer())
        .post('/inventory/reserve')
        .send({
          storeId: '1',
          assets: [
            {
              assetId: '1',
              quantity: 20
            },
            {
              assetId: '2',
              quantity: 2000
            },
            {
              assetId: '3',
              quantity: 20
            },
            {
              assetId: '4',
              quantity: 20
            }
          ]
        });

    expect(response.status).toBe(422);
    const result = JSON.parse(response.text);
    expect(result.message).toBe('Not enough items in stock for 2');

    // Check that nothing was reserved
    const status = await StockStatus.findOne({
      where: {
        storeId: '1',
        assetId: '1'
      }
    });
    expect(status.inStock).toBe('100'); // Bigint casts to string... =\ https://github.com/sequelize/sequelize/issues/1774
    done()
  });
});
