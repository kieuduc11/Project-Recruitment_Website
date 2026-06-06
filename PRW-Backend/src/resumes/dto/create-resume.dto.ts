import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateResumeDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'userId không được để trống' })
  @IsMongoId({ message: 'userId không hợp lệ' })
  userId: string;

  @IsNotEmpty({ message: 'url không được để trống' })
  @IsString({ message: 'url phải là chuỗi' })
  @IsUrl({}, { message: 'url không hợp lệ' })
  url: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  @IsMongoId({ message: 'companyId không hợp lệ' })
  companyId: string;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsMongoId({ message: 'jobId không hợp lệ' })
  jobId: string;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  @IsString({ message: 'url phải là chuỗi' })
  @IsUrl({}, { message: 'url không hợp lệ' })
  url: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  @IsMongoId({ message: 'companyId không hợp lệ' })
  companyId: string;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsMongoId({ message: 'jobId không hợp lệ' })
  jobId: string;
}