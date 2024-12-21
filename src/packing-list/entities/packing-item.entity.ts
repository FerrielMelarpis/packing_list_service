import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PackingList } from './packing-list.entity';

@Entity()
export class PackingItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ default: false })
  packed: boolean;

  @ManyToOne(() => PackingList, (packingList) => packingList.items)
  packingList: PackingList;
}
