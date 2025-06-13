import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private prisma;

  private salt = parseInt(process.env.CRYPT_SALT, 10) || 10;

  constructor(private readonly jwtService: JwtService) {
    this.prisma = new PrismaClient();
  }
  async create(authDto: AuthDto) {
    if (!authDto.login || !authDto.password) {
      throw new HttpException(
        'login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUser = await this.prisma.user.findFirst({
      where: { login: authDto.login },
    });
    if (existingUser) {
      throw new HttpException(
        'User with this login already exists',
        HttpStatus.CONFLICT,
      );
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      login: authDto.login,
      password: await this.cryptPassword(authDto.password),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user = await this.prisma.user.create({ data: newUser });
    return this.generateTokens(user);
  }

  private async cryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async login(authDto: AuthDto) {
    if (!authDto.login || !authDto.password) {
      throw new HttpException(
        'login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.findUnique({
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

  private async generateTokens(user: User) {
    const payload = { sub: user.id, username: user.login };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);
    return {
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
    return 'return new tokens here';
  }
}
