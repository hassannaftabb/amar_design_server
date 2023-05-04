import { IsString } from 'class-validator';

export class CreateDesignIdeaCategoryDto {
  @IsString()
  title: string;
  image: Express.Multer.File;
}
