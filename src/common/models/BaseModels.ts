import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default abstract class BaseModel extends BaseEntity {
  // ---- it would be a better solution ----
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modified: Date;
}
