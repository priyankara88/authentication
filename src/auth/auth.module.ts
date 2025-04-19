import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.shemas';
import configuration from 'src/config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserToken, UserTokenSchema } from './schema/usertoken.schema';

@Module({
  imports: [
    ConfigModule,
    // JwtModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = config.get<string>('jwt.secret');
        const expiresIn = config.get<string>('jwt.expiresIn') || '60m';
        console.log('✅ JWT Secret:', secret, expiresIn);
        if (!secret) {
          throw new Error('JWT secret is not defined in environment variables');
        }
        return {
          secret,
          expiresIn,
        };
      },
      global: true,
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserToken.name,
        schema: UserTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
