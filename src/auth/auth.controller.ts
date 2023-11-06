import { User } from '@prisma/client';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthDTO, AuthLoginDTO } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // /auth

  // auth/register

  // validation data
  // dto : Data Transfer Object
  @Post('register')
  @ApiOperation({ summary: 'Create new a user' })
  @ApiResponse({ status: 201, description: 'Success' })
  register(@Body() authDTO: AuthDTO) {
    return this.authService.register(authDTO);
    // Client request 1  -> Controller -> Service
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 403, description: 'Email is incorrect' })
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
  })
  @HttpCode(200)
  login(@Body() authLoginDTO: AuthLoginDTO) {
    return this.authService.login(authLoginDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Logout successfully',
  })
  logout(@Req() req: Request) {
    return {
      message: 'logout',
    };
  }
}
