import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { BaseEntity } from '../shared/base.entity';

@Entity('company')
export class CompanyEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => UserEntity, (user: UserEntity) => user.id)
  user: UserEntity[];
}
