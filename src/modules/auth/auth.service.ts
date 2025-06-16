import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  private prisma;
  private refreshTokenSecret =
    process.env.JWT_SECRET_REFRESH_KEY || 'default_refresh_secret';
  private refreshTokenExpireTime =
    process.env.TOKEN_REFRESH_EXPIRE_TIME || '7d';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.prisma = new PrismaClient();
  }

  async create(authDto: AuthDto) {
    const user = await this.userService.create(authDto);
    return this.generateTokens(user);
  }

  async login(authDto: AuthDto) {
    if (!authDto.login || !authDto.password) {
      throw new HttpException(
        'login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.findFirst({
      where: { login: authDto.login },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return this.generateTokens(user);
  }

  private async generateTokens(user: UserResponseDto) {
    const payload = { sub: user.id, username: user.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        expiresIn: this.refreshTokenExpireTime,
        secret: this.refreshTokenSecret,
      },
    );
    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.jwtService.verifyAsync(refreshToken);
      const dbUser = await this.userService.findOne(user.sub);
      return this.generateTokens(dbUser);
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
