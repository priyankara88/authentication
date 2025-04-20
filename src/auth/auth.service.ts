import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.shemas';
import { Model } from 'mongoose';
import { UserEntity, Userlogin } from './entities/userentity';
import * as bcrypt from 'bcrypt';
import { LoginUser } from './dto/login.user.dto';
import { JwtService } from '@nestjs/jwt';
import { log } from 'node:console';
import { UserToken } from './schema/usertoken.schema';
import { v4 as uuidv4 } from 'uuid';
import { reffreshtokendto } from './dto/reffresh.token.dto';
import { promises } from 'node:dns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserToken.name) private userToken: Model<UserToken>,
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
    const d = await this.loginuservv(isEmailInUse._id);
    const expirdate = new Date();
    expirdate.setDate(expirdate.getDate() + 5);

    const reffreshtoken = uuidv4();

    const reffreshtokenresukt = await this.createreffreshtoken(
      isEmailInUse._id,
      reffreshtoken,
      expirdate,
      d.access_token,
    );

    return {
      name: isEmailInUse.name,
      token: reffreshtokenresukt.access_token,
      reffreshtoken: reffreshtokenresukt.reffreshtoken,
    };
  }

  async loginuservv(userid) {
    const payload = JSON.stringify({ userid });
    console.log('payload', payload);

    try {
      const token = this.jwtservice.sign(payload);
      console.log('Token generated:', token);
      return { access_token: token };
    } catch (err) {
      console.error('JWT sign error:', err);
      throw err;
    }
  }

  async createreffreshtoken(userid, reffreshtoken, date, access_token) {
    const result = await this.userToken.create({
      userid,
      token: reffreshtoken,
      expiredate: date,
    });

    return { reffreshtoken, access_token };
  }

  async reffreshtoken(reffreshtokendto: reffreshtokendto) {
    const rfToken = await this.userToken.findOne({
      token: reffreshtokendto.reffreshtoken,
      expiredate: { $gte: new Date() },
    });

    if (!rfToken) {
      throw new UnauthorizedException();
    }
    return this.loginuservv(rfToken._id);
  }
}
