import { IsString } from 'class-validator';

export class UpdateDesignIdeaProjectDto {
  @IsString()
  title: string;
  @IsString()
  sizeOrDimensions: string;
  @IsString()
  description: string;
}
