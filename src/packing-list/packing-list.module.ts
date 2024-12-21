import { Module } from '@nestjs/common';
import { PackingListController } from './packing-list.controller';
import { PackingListService } from './packing-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingList } from './entities/packing-list.entity';
import { PackingItem } from './entities/packing-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackingList, PackingItem])],
  controllers: [PackingListController],
  providers: [PackingListService],
})
export class PackingListModule {}
