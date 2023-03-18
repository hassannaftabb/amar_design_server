import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BasicInfo } from './entities/user-basic-info.entity';
import { BusinessDetails } from './entities/user-business-details.entity';
import { Project } from './entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BasicInfo, BusinessDetails, Project]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
