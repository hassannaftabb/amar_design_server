import {
  IsString,
  IsDefined,
  IsObject,
  IsNotEmptyObject,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasicInfo } from '../entities/user-basic-info.entity';
import { BusinessDetails } from '../entities/user-business-details.entity';
import { ProviderEnum } from '../enums/provider.enum';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsString()
  @IsOptional()
  readonly googleAccessToken?: string;

  @IsString()
  @IsOptional()
  readonly facebookAccessToken?: string;

  @IsString()
  @IsOptional()
  @IsEnum(ProviderEnum)
  readonly provider?: string;

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
  businessDetailPhoto: Express.Multer.File;

  @IsOptional()
  logo: Express.Multer.File;
}
