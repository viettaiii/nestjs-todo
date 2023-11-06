import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDTO, AuthLoginDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(authDTO: AuthDTO) {
    const { email, password, fullName } = authDTO;

    const isEmail = await this.findByEmail(email);
    if (isEmail) throw new ForbiddenException('Email is already in use');
    // hash password
    const hashedPWD = await this.createHashPassword(password);

    // create a new user
    const user = await this.prismaService.user.create({
      data: { hashedPWD, email, fullName },
    });
    delete user.hashedPWD;
    return user;
    // const user = aw
    // Client request 1  -> Controller -> Service
  }

  async login(authLoginDTO: AuthLoginDTO) {
    const { email, password } = authLoginDTO;
    const user = await this.findByEmail(email);
    if (!user) throw new ForbiddenException('Email is incorrect');
    // compare password
    await this.comparePassword(user.hashedPWD, password);

    // create access token
    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    return user;
  }

  createHashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async comparePassword(hashedPWD: string, password: string): Promise<void> {
    const isChecked = await argon.verify(hashedPWD, password);
    if (!isChecked) throw new ForbiddenException('Credentials invalid');
    return;
  }

  createAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: '30m',
    });
  }
}
