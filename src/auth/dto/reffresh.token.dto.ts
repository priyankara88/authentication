import { IsString } from 'class-validator';

export class reffreshtokendto {
  @IsString()
  reffreshtoken: string;
}
