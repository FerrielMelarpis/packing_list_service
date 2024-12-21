import { Module } from '@nestjs/common';
import { PackingListController } from './packing-list.controller';
import { PackingListService } from './packing-list.service';

@Module({
  controllers: [PackingListController],
  providers: [PackingListService],
})
export class PackingListModule { }
