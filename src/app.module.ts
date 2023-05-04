import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Project } from './user/entities/project.entity';
import { AdminAuthGuard } from './auth/admin-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [AppController],
  providers: [AppService, AdminAuthGuard, JwtService],
})
export class AppModule {}
