import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard, JwtService, ConfigService],
})
export class AdminModule {}
