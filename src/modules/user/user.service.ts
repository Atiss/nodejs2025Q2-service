import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'uuid';
import { PrismaClient, User } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private prisma;
  private salt = parseInt(process.env.CRYPT_SALT, 10) || 10;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      login: createUserDto.login,
      password: await this.cryptPassword(createUserDto.password),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user = await this.prisma.user.create({ data: newUser });
    return this.convertToResponse(user);
  }

  async findAll() {
    return await this.prisma.user
      .findMany()
      .then((users) => users.map((user) => this.convertToResponse(user)));
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return this.convertToResponse(foundUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!validate(id) || !updateUserDto.newPassword) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const currentUser = await this.prisma.user.findUnique({ where: { id } });
    if (!currentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      updateUserDto.oldPassword,
      currentUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
    currentUser.password = updateUserDto.newPassword;
    currentUser.updatedAt = new Date();
    currentUser.version += 1;
    await this.prisma.user.update({ where: { id }, data: currentUser });
    return this.convertToResponse(currentUser);
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({ where: { id } });
    return `user with id ${id} deleted successfully`;
  }

  convertToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  private async cryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }
}
