import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
  UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Role } from '../../enums/role.enum';
import { REST } from '../../interfaces/rest.interface';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/role.guard';
import { CompanyService } from './company.service';
import { Roles } from '../../auth/role.decorator';
import { CompanyEntity } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { EntityNotFoundExceptionFilter } from '../../exceptions/entity-not-found-exception.filter';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Company')
@UseFilters(new EntityNotFoundExceptionFilter())
export class CompanyController implements REST {
  constructor(private readonly companyService: CompanyService) {}

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get()
  async find(): Promise<CompanyEntity[]> {
    return this.companyService.find();
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CompanyEntity> {
    return this.companyService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiBody({ type: CreateCompanyDto })
  @Post()
  async create(@Body() company: CreateCompanyDto): Promise<CompanyEntity> {
    return this.companyService.create(company);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiBody({ type: UpdateCompanyDto })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() company: UpdateCompanyDto,
  ): Promise<UpdateResult> {
    return this.companyService.update(id, company);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.companyService.delete(id);
  }
}
