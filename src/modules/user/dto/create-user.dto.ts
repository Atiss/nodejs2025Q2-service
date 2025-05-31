import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  password: string;
}
