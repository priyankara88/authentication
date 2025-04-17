import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.shemas';
import { Model } from 'mongoose';
import { UserEntity, Userlogin } from './entities/userentity';
import * as bcrypt from 'bcrypt';
import { LoginUser } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';
import { log } from 'node:console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtservice: JwtService,
  ) {}

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

    //const accesstoken = await this.jwtservice.sign({ email });
    const d = await this.loginuservv(email, password);

    return { name: 'success' };
  }

  async loginuservv(email, password) {
    const payload = JSON.stringify({ email: email, sub: password });
    try {
      const token = this.jwtservice.sign(payload);
      console.log('Token generated:', token);
      return { access_token: token };
    } catch (err) {
      console.error('JWT sign error:', err);
      throw err;
    }
  }
}
