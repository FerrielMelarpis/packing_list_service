import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingList } from './entities/packing-list.entity';
import { Repository } from 'typeorm';
import { PackingItem } from './entities/packing-item.entity';
import { CreatePackingListDto } from './dto/create-packing-list.dto';
import { UpdatePackingListDto } from './dto/update-packing-list.dto';
import { CreatePackingItemDto } from './dto/create-packing-item.dto';
import { UpdatePackingItemDto } from './dto/update-packing-item.dto';

export const enum ServiceErrorCode {
  CREATE_LIST_FAILED = 'CREATE_LIST_FAILED',
  UPDATE_LIST_FAILED = 'UPDATE_LIST_FAILED',
  GET_LIST_FAILED = 'GET_LIST_FAILED',
  FETCH_LISTS_FAILED = 'FETCH_LISTS_FAILED',
  DELETE_LIST_FAILED = 'DELETE_LIST_FAILED',
  ADD_ITEM_FAILED = 'ADD_ITEM_FAILED',
  UPDATE_ITEM_FAILED = 'UPDATE_ITEM_FAILED',
  DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED',
}
export type ServiceResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: ServiceErrorCode;
        message: string;
      };
    };

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

  async createPackingList(
    dto: CreatePackingListDto,
  ): Promise<ServiceResponse<PackingList>> {
    const packingList = this.packingListRepository.create(dto);
    try {
      const result = await this.packingListRepository.save(packingList);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create packing list: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.CREATE_LIST_FAILED,
          message: 'Failed to create packing list',
        },
      };
    }
  }

  async getPackingLists(): Promise<ServiceResponse<PackingList[]>> {
    try {
      const result = await this.packingListRepository.find({
        relations: {
          items: true,
        },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch packing lists: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.FETCH_LISTS_FAILED,
          message: 'Failed to fetch packing lists',
        },
      };
    }
  }

  async getPackingList(id: string): Promise<ServiceResponse<PackingList>> {
    try {
      const result = await this.packingListRepository.findOne({
        where: { id },
        relations: ['items'],
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get packing list with ID: ${id}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.GET_LIST_FAILED,
          message: 'Failed to get packing list',
        },
      };
    }
  }

  async updatePackingList(
    listId: string,
    dto: UpdatePackingListDto,
  ): Promise<ServiceResponse<PackingList>> {
    const result = await this.getPackingList(listId);

    if (!result.success) {
      return result;
    }
    const packingList = result.data;
    Object.assign(packingList, dto);
    try {
      const updated = await this.packingListRepository.save(packingList);
      return {
        success: true,
        data: updated,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update packing list with ID ${listId}: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.UPDATE_LIST_FAILED,
          message: 'Failed to update list',
        },
      };
    }
  }

  async deletePackingList(listId: string): Promise<ServiceResponse<number>> {
    try {
      const result = await this.packingListRepository.delete(listId);
      if (result.affected === 0) {
        this.logger.error(`List ${listId} not found.`);
        return {
          success: false,
          error: {
            code: ServiceErrorCode.DELETE_LIST_FAILED,
            message: 'Failed to delete list',
          },
        };
      }
      return {
        success: true,
        data: result.affected,
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete list ${listId}: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.DELETE_LIST_FAILED,
          message: 'Failed to delete list',
        },
      };
    }
  }

  /**
   * Items are always part of a List.
   * No need for a separate PackingItemService since there are no independent interaction with items.
   * To manage items within a list, we can encapsulate all the operations under this service as well.
   */

  async addItemToList(
    listId: string,
    itemDto: CreatePackingItemDto,
  ): Promise<ServiceResponse<PackingItem>> {
    const item = this.packingItemRepository.create({
      packingList: { id: listId },
      ...itemDto,
    });
    try {
      const result = await this.packingItemRepository.save(item);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to add item ${itemDto.name} to list ${listId}.`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.ADD_ITEM_FAILED,
          message: 'Failed to add item to list',
        },
      };
    }
  }

  async updateItem(
    itemId: string,
    dto: UpdatePackingItemDto,
  ): Promise<ServiceResponse<number>> {
    try {
      const { listId, ...updates } = dto;

      const result = await this.packingItemRepository.update(
        { id: itemId },
        {
          packingList: { id: listId },
          ...updates,
        },
      );
      if (result.affected === 0) {
        this.logger.error(`Failed to update item. Item ${itemId} not found.`);
        return {
          success: false,
          error: {
            code: ServiceErrorCode.UPDATE_ITEM_FAILED,
            message: 'Item not found',
          },
        };
      }
      return {
        success: true,
        data: result.affected,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update item ${itemId}: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.UPDATE_ITEM_FAILED,
          message: 'Failed to update item',
        },
      };
    }
  }

  async deleteItem(itemId: string): Promise<ServiceResponse<number>> {
    try {
      const result = await this.packingItemRepository.delete({ id: itemId });
      if (result.affected === 0) {
        this.logger.error(`Failed to delete item. Item ${itemId} not found.`);
        return {
          success: false,
          error: {
            code: ServiceErrorCode.DELETE_ITEM_FAILED,
            message: 'Item not found',
          },
        };
      }
      return {
        success: true,
        data: result.affected,
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete item ${itemId}: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: {
          code: ServiceErrorCode.DELETE_ITEM_FAILED,
          message: 'Failed to delete item',
        },
      };
    }
  }
}
