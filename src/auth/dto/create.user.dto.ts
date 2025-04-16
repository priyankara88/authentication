import { IsEmail, IsString, Matches, Max, Min } from '@nestjs/class-validator';

export class UserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
