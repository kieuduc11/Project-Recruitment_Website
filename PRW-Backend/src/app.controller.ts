import { Controller, Get, Post, Render, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './decorators/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  @Get()
  @Render("home.ejs")
  handleHomePage(){
    console.log(">>> Check port: ", this.configService.get<string>("PORT"));
    const message = this.appService.getHello()
    return {
      message
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Get("/profile")
  getProfile(@Request() req: any) {
    return req.user;
  }

}
