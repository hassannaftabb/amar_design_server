import { IsEmail, IsString } from 'class-validator';

export class FacebookAuthDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly facebookAccessToken: string;
}
