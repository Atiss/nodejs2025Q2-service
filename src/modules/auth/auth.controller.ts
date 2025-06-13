import {
  Controller,
  Post,
  Body,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() authDto: AuthDto) {
    return this.authService.create(authDto);
  }

  @Post('login')
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('refresh')
  refresh(@Body() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
