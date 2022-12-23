import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { REST } from '../../interfaces/rest.interface';
import { UserEntity } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppConfiguration } from '../../config/app.config';

@Injectable()
export class UserService implements REST {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async find(): Promise<UserEntity[]> {
    // Get all users from the database
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    // Find the user by ID
    return await this.userRepository.findOneOrFail(id);
  }

  async update(id: number, updatedUser: UpdateUserDto): Promise<UpdateResult> {
    // Find the entity with the given ID, or throw an error if no entity is found
    await this.userRepository.findOneOrFail(id);

    if (updatedUser.password) {
      // Hash the user's password
      const hashedPassword = await bcrypt.hash(
        updatedUser.password,
        AppConfiguration.bcrypt.salt,
      );
      updatedUser.password = hashedPassword;
    }

    // Update the user in the database
    return await this.userRepository.update(id, updatedUser);
  }

  async delete(id: number): Promise<DeleteResult> {
    // Find the entity with the given ID, or throw an error if no entity is found
    await this.userRepository.findOneOrFail(id);

    // Delete the user from the database
    return await this.userRepository.delete(id);
  }
}
