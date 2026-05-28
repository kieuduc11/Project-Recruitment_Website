import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  getHashPassword = async (password: string) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const hashPassword = await this.getHashPassword(password);
    const user = await this.userModel.create({
      email,
      password: hashPassword
    });
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users ?? [];
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "Not found user";

    const user = await this.userModel.findById({
      _id: id
    });
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({
      email: username
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "Not found user";

    const { email, password } = updateUserDto;
    const hashPassword = await this.getHashPassword(password);
    const result = await this.userModel.updateOne({ _id: id }, {
      email,
      password: hashPassword
    });
    return result;
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "Not found user";

    const result = this.userModel.deleteOne({ _id: id });

    return result;
  }
}
