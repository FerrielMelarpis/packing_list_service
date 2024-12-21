import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingList } from './entities/packing-list.entity';
import { Repository } from 'typeorm';
import { PackingItem } from './entities/packing-item.entity';

@Injectable()
export class PackingListService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(PackingList)
    private packingListRepository: Repository<PackingList>,
    @InjectRepository(PackingItem)
    private packingItemRepository: Repository<PackingItem>,
  ) {
    this.logger = new Logger(PackingListService.name);
  }

  createPackingList = (name: string): Promise<PackingList> => {
    const packingList = this.packingListRepository.create({ name });
    return this.packingListRepository.save(packingList);
  };

  findAll = (): Promise<PackingList[]> => {
    return this.packingListRepository.find({
      relations: {
        items: true,
      },
    });
  };

  findOne = (id: string): Promise<PackingList> => {
    return this.packingListRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  };

  updatePackingList = async (id: string, updates: Partial<PackingList>) => {
    const packingList = await this.findOne(id);

    if (packingList) {
      Object.assign(packingList, updates);
      return this.packingListRepository.save(packingList);
    }

    return null;
  };

  deletePackingList = async (id: string) => {
    const result = await this.packingListRepository.delete(id);
    return result.affected;
  };

  /**
   * Items are always part of a List.
   * No need for a separate PackingItemService since there are no independent interaction with items.
   * To manage items within a list, we can encapsulate all the operations under this service as well.
   */

  addItem = (
    packingListId: string,
    name: string,
    quantity: number,
    packed: boolean = false,
  ): Promise<PackingItem> => {
    try {
      const item = this.packingItemRepository.create({
        name,
        quantity,
        packed,
        packingList: { id: packingListId },
      });
      return this.packingItemRepository.save(item);
    } catch (error) {
      this.logger.error(
        `Failed to add item ${name} to list ${packingListId}.`,
        error.stack,
      );
      throw new Error(
        'Failed to add item. Ensure that item is being added to an existing PackingList',
      );
    }
  };

  updateItem = async (packingItemId: string, updates: Partial<PackingItem>) => {
    const result = await this.packingItemRepository.update(
      { id: packingItemId },
      updates,
    );

    if (result.affected === 0) {
      this.logger.error(`Packing item ${packingItemId} not found.`);
      throw new Error(`Packing item ${packingItemId} not found.`);
    }
  };

  deleteItem = async (packingItemId: string) => {
    const result = await this.packingItemRepository.delete({
      id: packingItemId,
    });

    if (result.affected === 0) {
      this.logger.error(`Packing item ${packingItemId} not found.`);
      throw new Error(`Packing item ${packingItemId} not found.`);
    }
  };
}
