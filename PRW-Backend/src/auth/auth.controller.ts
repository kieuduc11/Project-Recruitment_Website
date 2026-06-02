import { Controller, Post, UseGuards, Req, Res, Body, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';

@Controller("/auth")
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User login")
  async handleLogin(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(req.user, res);
  }

  @Public()
  @Post('register')
  @ResponseMessage("Register a new User")
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('account')
  @ResponseMessage("Get user information")
  getAccountInfo(@User() user: IUser) {
    return this.authService.getAccountInfo(user);
  }

  @Public()
  @Get('refresh')
  @ResponseMessage("Get access token by refresh token")
  handleRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies["refresh_token"];
    return this.authService.handleRefreshToken(refreshToken, res);
  }

  @Get('logout')
  @ResponseMessage("Logout user")
  logout(
    @Res({ passthrough: true }) res: Response,
    @User() user: IUser
  ) {
    return this.authService.logout(res, user);
  }
}
