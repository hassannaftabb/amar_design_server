import { IsString } from 'class-validator';

export class UpdateDesignIdeaCategoryDto {
  @IsString()
  title: string;
  image?: any;
}
