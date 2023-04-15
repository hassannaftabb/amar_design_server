import { IsEmail, IsNumber, IsString } from 'class-validator';

export class GetQouteDto {
  @IsNumber()
  professionalId: number;
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  phone: string;
  @IsString()
  message: string;
}
