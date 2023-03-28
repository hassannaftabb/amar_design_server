import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FacebookAuthDto } from './dto/facebook.dto';
import { GoogleAuthDto } from './dto/google.dto';
import { EmailLoginDto } from './dto/local.dto';
import { PhoneLoginDto } from './dto/phone.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login-via-email')
  loginViaEmail(@Body() emailLoginDto: EmailLoginDto) {
    return this.authService.logInViaEmail(emailLoginDto);
  }
  @Post('login-via-phone')
  loginViaPhone(@Body() phoneLoginDto: PhoneLoginDto) {
    return this.authService.loginViaPhone(phoneLoginDto);
  }
  @Post('auth-via-google')
  authViaGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.authViaGoogle(googleAuthDto);
  }
  @Post('auth-via-facebook')
  authViaFacebook(@Body() facebookAuthDto: FacebookAuthDto) {
    return this.authService.authViaFacebook(facebookAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check_auth')
  checkAuth(@Req() req) {
    return req.user;
  }
}
