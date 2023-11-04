import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from '../../../common/models/BaseModels';

@Entity()
export default class Description extends BaseModel {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  description: string;
}
