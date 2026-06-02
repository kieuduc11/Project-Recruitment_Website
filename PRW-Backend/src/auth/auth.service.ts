import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
        private configService: ConfigService
    ) { };

    async validateUser(username: string, password: string) {
        const user = (await this.userService.findOneByUsername(username));

        if (!user) return null;

        const isValidPassword = await this.userService.isValidPassword(password, user.password);
        if (isValidPassword) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }

        return null;
    };

    createRefreshToken(payload: any) {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000 // seconds
        });
        return refreshToken;
    }

    async login(user: IUser, res: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "access token",
            iss: "from server",
            _id, name, email, role
        };

        const refreshToken = this.createRefreshToken({ ...payload, sub: "refresh token" });
        await this.userService.updateUserToken(refreshToken, _id)
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) // miliseconds
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: { _id, name, email, role }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const { email, password } = registerUserDto;
        const isUniqueEmail = await this.userService.isUniqueEmail(email);

        if (!isUniqueEmail) {
            throw new ConflictException("Email đã được đăng ký")
        }

        const hashPassword = await this.userService.getHashPassword(password);
        const user = await this.userModel.create({
            ...registerUserDto,
            password: hashPassword,
            role: "USER"
        });
        return {
            _id: user._id,
            createdAt: user.createdAt
        };
    }

    getAccountInfo(user: IUser) {
        const { _id, name, email, role } = user
        return {
            user: { _id, name, email, role }
        }
    }

    async handleRefreshToken(refreshToken: string, res: Response) {
        try {
            const result = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET")
            })

            const user = await this.userService.findUserByRefreshToken(refreshToken);
            if (!user) throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login")

            res.clearCookie("refresh_token");
            return await this.login({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }, res);

        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login")
        }
    }
}
