import { IsString } from 'class-validator';

export class CreateDesignIdeasProjectDto {
  @IsString()
  title: string;
  @IsString()
  sizeOrDimensions: string;
  @IsString()
  description: string;
  images?: Express.Multer.File[];
}
