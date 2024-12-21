import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PackingListService } from './packing-list.service';
import { CreatePackingListDto } from './dto/create-packing-list.dto';
import { UpdatePackingListDto } from './dto/update-packing-list.dto';
import { CreatePackingItemDto } from './dto/create-packing-item.dto';
import { UpdatePackingItemDto } from './dto/update-packing-item.dto';

@Controller('api/v1/packing-lists')
export class PackingListController {
  constructor(private readonly packingListService: PackingListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePackingListDto) {
    const result = await this.packingListService.createPackingList(dto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  @Get()
  async findAll() {
    const result = await this.packingListService.getPackingLists();
    if (!result.success) {
      throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  @Get(':listId')
  async findOne(@Param('listId') id: string) {
    const result = await this.packingListService.getPackingList(id);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put(':listId')
  async update(@Param('listId') id: string, @Body() dto: UpdatePackingListDto) {
    const result = await this.packingListService.updatePackingList(id, dto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':listId')
  async remove(@Param('listId') id: string) {
    const result = await this.packingListService.deletePackingList(id);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post(':listId/items')
  async addItem(
    @Param('listId') listId: string,
    @Body() dto: CreatePackingItemDto,
  ) {
    const result = await this.packingListService.addItemToList(listId, dto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Put('items/:itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdatePackingItemDto,
  ) {
    const result = await this.packingListService.updateItem(itemId, dto);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    const result = await this.packingListService.deleteItem(itemId);
    if (!result.success) {
      throw new HttpException(result, HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
