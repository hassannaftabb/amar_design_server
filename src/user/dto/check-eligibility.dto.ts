import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckEligibilityDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  phone?: string;
}
