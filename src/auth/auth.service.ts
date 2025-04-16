import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.shemas';
import { Model } from 'mongoose';
import { UserEntity, Userlogin } from './entities/userentity';
import * as bcrypt from 'bcrypt';
import { LoginUser } from './dto/login.user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(userdto): Promise<UserEntity> {
    const { name, email, password } = userdto;
    const emailinuse = await this.userModel.findOne({ email: userdto.email });

    if (emailinuse) {
      throw new BadRequestException('email alrady inuse');
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const result = await this.userModel.create({
      name,
      email,
      password: hashpassword,
    });

    return {
      name: result.name,
      email: result.email,
      password: result.password,
    };
  }

  async loginuser(logindto): Promise<Userlogin> {
    const { email, password } = logindto;
    const isEmailInUse = await this.userModel.findOne({ email });

    if (!isEmailInUse) {
      throw new BadRequestException('Alrady Login');
    }

    const passwordmach = await bcrypt.compare(
      logindto.password,
      isEmailInUse.password,
    );
    if (!passwordmach) {
      throw new BadRequestException('Password Not Match');
    }
    return { name: 'success login' };
  }
}
