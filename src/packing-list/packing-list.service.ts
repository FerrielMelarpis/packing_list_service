import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingList } from './entities/packing-list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackingListService {
  constructor(
    @InjectRepository(PackingList)
    private packingListRepository: Repository<PackingList>,
  ) {}

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
}
