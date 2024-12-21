import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PackingItem } from './packing-item.entity';

@Entity()
export class PackingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => PackingItem, (item) => item.packingList, { cascade: true })
  items: PackingItem[];
}
