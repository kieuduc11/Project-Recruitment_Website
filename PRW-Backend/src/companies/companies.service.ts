import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const company = this.companyModel.create(
      {
        ...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return company;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "Not found company";

    const result = this.companyModel.updateOne({_id: id}, {
      ...updateCompanyDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
