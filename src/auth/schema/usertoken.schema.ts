import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class UserToken extends Document {
  @Prop({ require: true, type: mongoose.Types.ObjectId })
  userid: mongoose.Types.ObjectId;
  @Prop({ required: true })
  token: string;
  @Prop({ required: true })
  expiredate: Date;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
