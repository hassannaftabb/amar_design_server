import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-design-idea-category.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
