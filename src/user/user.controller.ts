import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Project } from './entities/project.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetQouteDto } from './dto/get-qoute.dto';

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
  async checkEligibility(@Body() body: CheckEligibilityDto) {
    const result: any = await this.userService.checkEligibility(body);
    if (result.success && result.isEligible) {
      return { message: 'User is eligible', status: HttpStatus.OK };
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseInterceptors(FilesInterceptor('projectImages'))
  @Post('add-project/:id')
  async addProjectToUser(
    @Param('id') userId: number,
    @Body() project: CreateProjectDto,
    @UploadedFiles() projectImages: Array<Express.Multer.File>,
  ): Promise<Project> {
    const createdProject = await this.userService.createProject(
      userId,
      project,
      projectImages,
    );
    return createdProject;
  }

  @Get('vendor/:userId')
  async getUserById(@Param('userId') userId: number) {
    return this.userService.getVendorById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:userId')
  async getProfileById(@Param('userId') userId: number) {
    return this.userService.getProfileById(userId);
  }

  @Get('professionals')
  async getProfessionals() {
    return this.userService.getProfessionals();
  }

  @Post('qoute')
  async getQouteFromUserWithEmail(@Body() getQouteDto: GetQouteDto) {
    return this.userService.sendQouteToProfessionalThroughEmail(getQouteDto);
  }
}
