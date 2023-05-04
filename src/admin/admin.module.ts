import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignIdeaCategory } from './entities/design-idea-category.entity';
import { DesignIdeaProject } from './entities/design-idea-project,entity';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([DesignIdeaCategory, DesignIdeaProject]),
    S3Module,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard, JwtService, ConfigService],
})
export class AdminModule {}
