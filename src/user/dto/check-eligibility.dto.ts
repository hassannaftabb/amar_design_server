import { IsEmail, IsString } from 'class-validator';

export class CheckEligibilityDto {
  @IsString()
  @IsEmail()
  email: string;
}
