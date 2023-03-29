import { IsString } from 'class-validator';

export class PhoneLoginDto {
  @IsString()
  readonly phone: string;

  @IsString()
  readonly firebaseAccessToken: string;
}
