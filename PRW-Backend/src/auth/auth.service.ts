import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
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
        const {_id, name, email, role} = user;
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
}
