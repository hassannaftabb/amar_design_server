import { IsString } from 'class-validator';

export class DeleteDesignIdeaProjectImageDto {
  @IsString()
  url: string;
}
