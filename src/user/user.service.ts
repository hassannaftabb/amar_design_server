import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FilesDtoForUser } from './dto/files.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(files: FilesDtoForUser, createUserDto: CreateUserDto) {
    const userToCreate: any = {
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      basicInfo: createUserDto.basicInfo,
      ...(createUserDto.businessDetails && {
        businessDetails: {
          ...createUserDto.businessDetails,
          photo: files.businessDetailPhoto,
          logo: files.logo,
        },
      }),
      ...(createUserDto.projects && {
        projects: JSON.parse(createUserDto.projects),
      }),
    };
    console.log(createUserDto);
    const isExistingUser = await this.getUserByEmail(createUserDto.email);
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
  async checkEligibility(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      throw new InternalServerErrorException(
        'User with this email already exists!',
      );
    } else {
      return { success: true, isEligible: true };
    }
  }
}
