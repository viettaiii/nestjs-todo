import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDTO, AuthLoginDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(authDTO: AuthDTO) {
    const { email, password, fullName } = authDTO;

    const isEmail = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (isEmail) throw new ForbiddenException('Email is existing');

    // hash password
    const hashedPWD = await this.createHashPassword(password);

    // create a new user
    const user = await this.prismaService.user.create({
      data: { hashedPWD, email, fullName },
    });

    return user;
    // const user = aw
    // Client request 1  -> Controller -> Service
  }

  async login(authLoginDTO: AuthLoginDTO) {
    const { email, password } = authLoginDTO;
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) throw new NotFoundException('Email/password incorrect');

    // compare password
    const isChecked = await this.comparePassword(user.hashedPWD, password);

    if (!isChecked) throw new ForbiddenException('Credentials invalid');

    // create access token
    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
    };
  }

  createHashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  comparePassword(hashedPWD: string, password: string): Promise<boolean> {
    return argon.verify(hashedPWD, password);
  }

  createAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload, {
      secret: 'secret',
      expiresIn: '30m',
    });
  }
}
