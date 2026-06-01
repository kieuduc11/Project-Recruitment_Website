import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller("/auth")
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ResponseMessage("Register a new User")
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
