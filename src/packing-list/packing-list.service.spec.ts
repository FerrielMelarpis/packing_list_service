import { Test, TestingModule } from '@nestjs/testing';
import { PackingListService } from './packing-list.service';
import { Repository } from 'typeorm';
import { PackingItem } from './entities/packing-item.entity';
import { PackingList } from './entities/packing-list.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PackingListService', () => {
  let service: PackingListService;
  let packingListRepository: Repository<PackingList>;
  let packingItemRepository: Repository<PackingItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackingListService,
        {
          provide: getRepositoryToken(PackingList),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PackingItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PackingListService>(PackingListService);
    packingListRepository = module.get(getRepositoryToken(PackingList));
    packingItemRepository = module.get(getRepositoryToken(PackingItem));
  });

  // @TODO: Add more tests like this for the other methods for PackingList
  // These types of test is not actually a good way to cover use cases.
  describe('createPackingList', () => {
    it('should create a new packing list', async () => {
      const mockPackingList = {
        id: 'list-1',
        name: 'list-1',
      };
      jest
        .spyOn(packingListRepository, 'create')
        .mockReturnValue(mockPackingList as PackingList);
      jest
        .spyOn(packingListRepository, 'save')
        .mockResolvedValue(mockPackingList as PackingList);

      const result = await service.createPackingList({
        name: mockPackingList.name,
      });

      expect(result.success).toBe(true);
      if (!result.success) {
        // TS doesn't narrow down discriminated unions when used with jest expect method.
        // We can just stop following assertions if the previous one failed.
        return;
      }
      expect(result.data).toEqual(mockPackingList);
      expect(packingListRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockPackingList.name,
        }),
      );
    });
  });

  // Test some crucial happy paths
  describe('addItemToList', () => {
    it('should add item to list', async () => {
      const mockList = {
        id: 'list-1',
        name: 'list-1',
      };
      const mockItem = {
        name: 'item-1',
        quantity: 2,
        packingList: {
          id: mockList.id,
        },
      };
      jest
        .spyOn(packingItemRepository, 'create')
        .mockReturnValue(mockItem as PackingItem);
      jest
        .spyOn(packingItemRepository, 'save')
        .mockResolvedValue(mockItem as PackingItem);

      // eslint-disable-next-line
      const { packingList: _, ...itemDto } = mockItem;
      const result = await service.addItemToList(mockList.id, itemDto);
      expect(result.success).toBe(true);
      if (!result.success) {
        return;
      }
      expect(result.data).toEqual(mockItem);
      expect(packingItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(itemDto),
      );
    });
  });

  describe('updateItem', () => {
    it('should update item', async () => {
      const mockList = {
        id: 'list-1',
        name: 'list-1',
      };
      const mockItem = {
        name: 'item-1',
        quantity: 2,
        packingList: {
          id: mockList.id,
        },
      };
      jest
        .spyOn(packingItemRepository, 'create')
        .mockReturnValue(mockItem as PackingItem);
      jest
        .spyOn(packingItemRepository, 'save')
        .mockResolvedValue(mockItem as PackingItem);

      // eslint-disable-next-line
      const { packingList: _, ...itemDto } = mockItem;
      const result = await service.addItemToList(mockList.id, itemDto);
      expect(result.success).toBe(true);
      if (!result.success) {
        return;
      }
      expect(result.data).toEqual(mockItem);
      expect(packingItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(itemDto),
      );
    });
    it('should move item to other list', async () => {
      const mockOtherList = {
        id: 'list-2',
        name: 'list-2',
      };
      jest.spyOn(packingItemRepository, 'update').mockResolvedValue({
        affected: 1,
        raw: null,
        generatedMaps: [],
      });

      // eslint-disable-next-line
      const result = await service.updateItem('item-1', {
        quantity: 1,
        listId: mockOtherList.id,
      });
      expect(result.success).toBe(true);
      if (!result.success) {
        return;
      }
      expect(result.data).toEqual(1);
      expect(packingItemRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'item-1' }),
        expect.objectContaining({
          quantity: 1,
          packingList: { id: mockOtherList.id },
        }),
      );
    });
  });

  // @TODO: Test error scenarios
});
