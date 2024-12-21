import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PackingList } from './packing-list.entity';

@Entity()
export class PackingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => PackingList, (packingList) => packingList.items)
  packingList: PackingList;
}
