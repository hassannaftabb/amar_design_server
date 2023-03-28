import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BasicInfo } from './entities/user-basic-info.entity';
import { BusinessDetails } from './entities/user-business-details.entity';
import { Project } from './entities/project.entity';
import { S3Module } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    S3Module,
    TypeOrmModule.forFeature([User, BasicInfo, BusinessDetails, Project]),
  ],
  controllers: [UserController],
  providers: [UserService, S3Service],
  exports: [UserService],
})
export class UserModule {}
