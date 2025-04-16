import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/create.user.dto';
import { Userlogin } from './entities/userentity';
import { LoginUser } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userdto: UserDto) {
    return this.authService.signup(userdto);
  }

  @Post('login')
  async loginuser(@Body() loginDto: LoginUser): Promise<Userlogin> {
    return this.authService.loginuser(loginDto);
  }
}
