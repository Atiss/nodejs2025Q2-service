import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { validate } from 'uuid';
import { users } from '../../db/database';

@Injectable()
export class UserService {
  private users: User[] = users;
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return this.excludePassword(newUser);
  }

  findAll() {
    return this.users.map((user) => this.excludePassword(user));
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return this.excludePassword(foundUser);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!validate(id) || !updateUserDto.newPassword) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const currentUser = this.users.find((user) => user.id === id);
    if (!currentUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    if (
      updateUserDto.oldPassword &&
      updateUserDto.oldPassword !== currentUser.password
    ) {
      throw new HttpException(
        'old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
    currentUser.password = updateUserDto.newPassword;
    currentUser.updatedAt = Date.now();
    currentUser.version += 1;
    return this.excludePassword(currentUser);
  }

  remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid user id', HttpStatus.BAD_REQUEST);
    }
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    this.users.splice(userIndex, 1);
    return `user with id ${id} deleted successfully`;
  }

  excludePassword(user: User): Omit<User, 'password'> {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
