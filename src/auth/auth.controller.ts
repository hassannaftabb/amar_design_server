import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './authenticated.guard';
import { LoginDTO } from './dto/Login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.LogIn(loginDTO.email, loginDTO.password);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('check_auth')
  checkAuth(@Request() req) {
    return {
      user: req.user,
      message: 'Authenticated',
    };
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req) {
    req.session.destroy();
    return { message: 'Logged Out Successfully', statusCode: 200 };
  }
}
