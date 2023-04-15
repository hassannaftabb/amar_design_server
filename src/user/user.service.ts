import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FilesDtoForUser } from './dto/files.dto';
import { S3Service } from 'src/s3/s3.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { ProviderEnum } from './enums/provider.enum';
import { GetQouteDto } from './dto/get-qoute.dto';
import * as nodemailer from 'nodemailer';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private s3Service: S3Service,
  ) {}
  async create(files: FilesDtoForUser, createUserDto: CreateUserDto) {
    if (
      createUserDto.provider === ProviderEnum.LOCAL &&
      !createUserDto.password
    ) {
      throw new NotFoundException('Password must be provided!');
    } else {
      //Bucket keys
      const bucketKeyForBusinessDetailPhoto =
        files.businessDetailPhoto &&
        `${files.businessDetailPhoto[0].fieldname}${Date.now()}`;
      const bucketKeyForBusinessLogo =
        files.logo && `${files.logo[0].fieldname}${Date.now()}`;
      //Urls generation
      const fileUrlForBusinessDetailPhoto =
        files.businessDetailPhoto &&
        (await this.s3Service.uploadFile(
          files.businessDetailPhoto[0],
          bucketKeyForBusinessDetailPhoto,
        ));
      const fileUrlForBusinessLogo =
        files.logo &&
        (await this.s3Service.uploadFile(
          files.logo[0],
          bucketKeyForBusinessLogo,
        ));
      const userToCreate: any = {
        ...(createUserDto.email && { email: createUserDto.email }),
        ...(createUserDto.phone && { phone: createUserDto.phone }),
        ...(createUserDto.password && {
          password: await bcrypt.hash(createUserDto.password, 10),
        }),
        basicInfo: createUserDto.basicInfo,
        ...(createUserDto.businessDetails && {
          businessDetails: {
            ...createUserDto.businessDetails,
            photo: fileUrlForBusinessDetailPhoto || '',
            logo: fileUrlForBusinessLogo || '',
          },
        }),
        ...(createUserDto.googleAccessToken && {
          googleAccessToken: createUserDto.googleAccessToken,
        }),
        ...(createUserDto.facebookAccessToken && {
          facebookAccessToken: createUserDto.facebookAccessToken,
        }),
        ...(createUserDto.firebaseAccessToken && {
          firebaseAccessToken: createUserDto.firebaseAccessToken,
        }),
      };
      const isExistingUser = createUserDto.email
        ? await this.getUserByEmail(createUserDto.email)
        : await this.getUserByPhoneNumber(createUserDto.phone);
      if (isExistingUser) {
        throw new InternalServerErrorException('User already exists!');
      }
      const user = this.userRepository.create(userToCreate);
      return this.userRepository
        .save(user)
        .then((user) => user)
        .catch((err) => {
          throw new HttpException(`${err}`, HttpStatus.BAD_REQUEST);
        });
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return existingUser;
    } else {
      return null;
    }
  }
  async getUserByPhoneNumber(phone: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { phone: phone },
    });
    if (existingUser) {
      return existingUser;
    } else {
      return null;
    }
  }
  async getUserById(id: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (existingUser) {
      return existingUser;
    } else {
      return null;
    }
  }
  async checkEligibility(checkEligibilityDto: CheckEligibilityDto) {
    if (checkEligibilityDto.email) {
      const existingUser = await this.getUserByEmail(checkEligibilityDto.email);
      if (existingUser) {
        throw new InternalServerErrorException('User already exists!');
      } else {
        return { success: true, isEligible: true };
      }
    } else {
      const existingUser = await this.getUserByPhoneNumber(
        checkEligibilityDto.phone,
      );
      if (existingUser) {
        throw new InternalServerErrorException('User already exists!');
      } else {
        return { success: true, isEligible: true };
      }
    }
  }
  async createProject(
    id: number,
    project: CreateProjectDto,
    projectImages: Array<Express.Multer.File>,
  ): Promise<Project> {
    const user: User = await this.getUserById(id);
    if (!user) {
      throw new InternalServerErrorException('User with this id doesnt exist.');
    }
    const imgUrls = await Promise.all(
      projectImages.map(async (img: Express.Multer.File) => {
        const bucketKey = `${img.fieldname}${Date.now()}`;
        const uploadResponse = await this.s3Service.uploadFile(img, bucketKey);
        return uploadResponse;
      }),
    );

    const projectToCreate = {
      projectName: project.projectName,
      projectAddress: project.projectAddress,
      projectCategory: project.projectCategory,
      projectCost: project.projectCost,
      projectYear: project.projectYear,
      projectImages: imgUrls,
      user: user,
    };
    const newProject = this.projectRepository.create(projectToCreate);
    const createdProject = await this.projectRepository.save(newProject);
    return createdProject;
  }

  async getVendorById(id: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['projects', 'basicInfo', 'businessDetails'],
    });
    if (existingUser) {
      return existingUser;
    } else {
      throw new NotFoundException('No user with this ID.');
    }
  }
  async getProfileById(id: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['projects', 'basicInfo', 'businessDetails'],
    });
    if (existingUser) {
      return existingUser;
    } else {
      throw new NotFoundException('No user with this ID.');
    }
  }
  async getProfessionals(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['projects', 'basicInfo', 'businessDetails'],
    });
    return users;
  }
  async sendQouteToProfessionalThroughEmail(getQouteDto: GetQouteDto) {
    const user = await this.getUserById(getQouteDto.professionalId);
    if (user) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hassannaftabb@gmail.com',
          pass: 'mnqkfdveytiuwdjy',
        },
      });

      const mailOptions = {
        from: 'hassannaftabb@gmail.com',
        to: user.email,
        subject: `${getQouteDto.name}-(${getQouteDto.email}) wants a qoute from you!`,
        text: getQouteDto.message,
      };

      await transporter
        .sendMail(mailOptions)
        .then(() => {
          return { success: true, message: 'Quote Sent!' };
        })
        .catch((error) => {
          console.log(error);
          throw new InternalServerErrorException("Couldn't send email!");
        });

      // Return success message object
      return { success: true, message: 'Quote Sent!' };
    } else {
      throw new NotFoundException(
        'There is no professional registred with this email!',
      );
    }
  }
}
