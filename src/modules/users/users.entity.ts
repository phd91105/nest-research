import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from '../company/company.entity';
import { BaseEntity } from '../shared/base.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends BaseEntity {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @Column()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  @Column({ length: 50 })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Username is too short',
  })
  @ApiProperty({ type: String })
  @Column()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short',
  })
  @ApiProperty({ type: String })
  @Column()
  @Exclude()
  password: string;

  @IsNumber()
  @ApiProperty({ type: Number })
  @Column()
  role: number;

  @IsNumber()
  @ApiProperty({ type: Number })
  @ManyToOne(() => CompanyEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  company: CompanyEntity;
}
