import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { };

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOneByUsername(username);

        if (!user) return null;

        const isValidPassword = this.userService.isValidPassword(password, user.password);
        if (isValidPassword) {
            return user
        }

        return null;
    };

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
