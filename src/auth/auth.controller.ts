import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDTO, AuthLoginDTO } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // /auth

  // auth/register

  // validation data
  // dto : Data Transfer Object
  @Post('register')
  register(@Body() authDTO: AuthDTO) {
    return this.authService.register(authDTO);
    // Client request 1  -> Controller -> Service
  }

  @Post('login')
  login(@Body() authLoginDTO: AuthLoginDTO) {
    return this.authService.login(authLoginDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Req() req: Request) {
    return {
      message: 'logout',
    };
  }
}
