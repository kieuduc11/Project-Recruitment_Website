import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = async (password: string) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }

  async isUniqueEmail(email: string) {
    const result = await this.userModel.findOne({ email });
    return !result;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, password } = createUserDto;

    const isUniqueEmail = await this.isUniqueEmail(email);
    if (!isUniqueEmail) {
      throw new ConflictException("Email đã được đăng ký");
    }

    const hashPassword = await this.getHashPassword(password);
    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: createdUser._id,
      createdAt: createdUser.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort, population } = aqp(queryString);
    delete filter.page;
    delete filter.limit;

    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .select("-password")
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("User id không hợp lệ")
    }

    const user = await this.userModel.findById({
      _id: id
    })
      .select("-password");

    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({
      email: username
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("User id không hợp lệ")
    }

    const { password } = updateUserDto;
    const hashPassword = await this.getHashPassword(password);

    const result = await this.userModel.updateOne({ _id: id }, {
      ...updateUserDto,
      password: hashPassword,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
    return result;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("User id không hợp lệ")
    }

    const result = await this.userModel.softDelete({ _id: id });
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      deleted: result
    };
  }

  async updateUserToken(refreshToken: string, id: string) {
    const result = await this.userModel.updateOne({ _id: id }, {
        refreshToken
      });
    return result
  }

  async findUserByRefreshToken(refreshToken: string) {
    const user = await this.userModel.findOne({refreshToken}).select("-password");
    return user
  }
}
