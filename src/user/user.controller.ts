import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'businessDetailPhoto', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ]),
  )
  @Post()
  create(
    @UploadedFiles()
    files: {
      businessDetailPhoto: Express.Multer.File;
      logo: Express.Multer.File;
    },
    @Body() body: CreateUserDto,
  ) {
    return this.userService.create(files, body);
  }
  @Post('check-eligibility')
  async checkEligibility(@Body('email') email: string) {
    const result: any = await this.userService.checkEligibility(email);
    if (result.success && result.isEligible) {
      return { message: 'User is eligible', status: HttpStatus.OK };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }
}
