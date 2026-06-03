import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsString,
    ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsString({ message: 'Name phải có kiểu dữ liệu là string' })
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsArray({ message: 'Skills phải là array' })
    @ArrayNotEmpty({ message: 'Skills không được để trống' })
    @IsString({
        each: true,
        message: 'Mỗi skill phải có kiểu dữ liệu là string',
    })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsString({ message: 'Location phải có kiểu dữ liệu là string' })
    @IsNotEmpty({ message: 'Location không được để trống' })
    location: string;

    @Type(() => Number)
    @IsNumber(
        {},
        {
            message: 'Salary phải có kiểu dữ liệu là number',
        },
    )
    salary: number;

    @Type(() => Number)
    @IsNumber(
        {},
        {
            message: 'Quantity phải có kiểu dữ liệu là number',
        },
    )
    quantity: number;

    @IsString({ message: 'Level phải có kiểu dữ liệu là string' })
    @IsNotEmpty({ message: 'Level không được để trống' })
    level: string;

    @IsString({ message: 'Description phải có kiểu dữ liệu là string' })
    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @Type(() => Date)
    @IsDate({
        message: 'Start date phải có định dạng ngày hợp lệ',
    })
    startDate: Date;

    @Type(() => Date)
    @IsDate({
        message: 'End date phải có định dạng ngày hợp lệ',
    })
    endDate: Date;

    @IsBoolean({
        message: 'IsActive phải có kiểu dữ liệu là boolean',
    })
    isActive: boolean;
}