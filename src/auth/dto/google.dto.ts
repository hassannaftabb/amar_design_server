import { IsEmail, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly googleAccessToken: string;
}
