import {
  IsString,
  IsDefined,
  IsObject,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasicInfo } from '../entities/user-basic-info.entity';
import { BusinessDetails } from '../entities/user-business-details.entity';

export class CreateUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => BasicInfo)
  readonly basicInfo: BasicInfo;

  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => BusinessDetails)
  readonly businessDetails: BusinessDetails;

  @IsOptional()
  readonly projects?: string;
  businessDetailPhoto: Express.Multer.File;
  logo: Express.Multer.File;
}
