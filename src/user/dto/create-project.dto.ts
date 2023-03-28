import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  projectName: string;
  @IsString()
  projectAddress: string;
  @IsString()
  projectYear: string;
  @IsString()
  projectCost: string;
  @IsString()
  projectCategory: string;
  projectImages?: Array<Express.Multer.File>;
}
