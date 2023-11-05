import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO, AuthLoginDTO } from './dto';
import { AuthService } from './auth.service';

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

  @Post('logout')
  logout() {
    return 'logout';
  }
}
