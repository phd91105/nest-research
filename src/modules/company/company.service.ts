import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';
import { REST } from '../../interfaces/rest.interface';
import { CompanyEntity } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService implements REST {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async find(): Promise<CompanyEntity[]> {
    // Get all company from the database
    return await this.companyRepository.find();
  }

  async findOne(id: number): Promise<CompanyEntity> {
    // Find the entity with the given ID, or throw an error if no entity is found
    return await this.companyRepository.findOneOrFail(id);
  }

  async create(company: CreateCompanyDto): Promise<CompanyEntity> {
    // create new company
    return await this.companyRepository.save(company);
  }

  async update(id: number, company: UpdateCompanyDto): Promise<UpdateResult> {
    // Find the entity with the given ID, or throw an error if no entity is found
    await this.companyRepository.findOneOrFail(id);

    // Update the company in the database
    return await this.companyRepository.update(id, company);
  }

  async delete(id: number): Promise<DeleteResult> {
    // Find the entity with the given ID, or throw an error if no entity is found
    await this.companyRepository.findOneOrFail(id);

    // Delete the company from the database
    return await this.companyRepository.delete(id);
  }
}
