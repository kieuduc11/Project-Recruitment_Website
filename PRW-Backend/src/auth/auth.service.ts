import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
    ) { };

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOneByUsername(username);

        if (!user) return null;

        const isValidPassword = await this.userService.isValidPassword(password, user.password);
        if (isValidPassword) {
            return user
        }

        return null;
    };

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id, name, email, role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id, name, email, role
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const { name, email, password, age, gender, address } = registerUserDto;
        const isUniqueEmail = await this.userService.isUniqueEmail(email);

        if (!isUniqueEmail) {
            throw new ConflictException("Email đã được đăng ký")
        }

        const hashPassword = await this.userService.getHashPassword(password);
        const user = await this.userModel.create({
            name,
            email,
            password: hashPassword,
            age,
            gender,
            address,
            role: "USER"
        });
        return {
            _id: user._id,
            createdAt: user.createdAt
        };
    }
}
