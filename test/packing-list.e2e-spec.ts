import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { PackingList } from '../src/packing-list/entities/packing-list.entity';
import { PackingItem } from '../src/packing-list/entities/packing-item.entity';
import { PackingListModule } from '../src/packing-list/packing-list.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('PackingListController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const entities = [PackingList, PackingItem];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities,
          synchronize: true,
          dropSchema: true,
        }),
        PackingListModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  let list1: PackingList;
  let list2: PackingList;
  let item1: PackingItem;

  beforeEach(async () => {
    // Clear all data before each test
    await dataSource.synchronize(true);

    // Seed the database with test data
    const listRepo = dataSource.getRepository(PackingList);
    const itemRepo = dataSource.getRepository(PackingItem);

    // Create two lists
    list1 = await listRepo.save({ name: 'List 1' });
    list2 = await listRepo.save({ name: 'List 2' });

    // Create an item in list1
    item1 = await itemRepo.save({
      name: 'item-1',
      quantity: 1,
      packingList: list1,
    });

    // refresh list1
    list1 = await listRepo.findOne({ where: { id: list1.id } });
  });

  // @TODO: test all fetch endpoints, should be similar to this test suite
  it('GET /api/v1/packing-lists', () => {
    return request(app.getHttpServer())
      .get('/api/v1/packing-lists')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toStrictEqual([
          {
            id: list1.id,
            name: list1.name,
            items: [
              {
                id: item1.id,
                name: item1.name,
                quantity: item1.quantity,
              },
            ],
          },
          {
            id: list2.id,
            name: list2.name,
            items: [],
          },
        ]);
      });
  });

  it('POST /api/v1/packing-lists/:listId/items', async () => {
    return request(app.getHttpServer())
      .post(`/api/v1/packing-lists/${list2.id}/items`)
      .send({
        name: 'item-2',
        quantity: 3,
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toMatchObject({
          name: 'item-2',
          quantity: 3,
          packingList: {
            id: list2.id,
          },
        });
      });
  });

  it('PUT /api/v1/packing-lists/items/:itemId', async () => {
    return request(app.getHttpServer())
      .put(`/api/v1/packing-lists/items/${item1.id}`)
      .send({
        name: 'something-new',
        quantity: 3,
        // can also move to other list
        listId: list2.id,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBe(1);
      });
  });

  // @TODO: Add more happy and error path tests.

  afterAll(async () => {
    await app.close();
  });
});
