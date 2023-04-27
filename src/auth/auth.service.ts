import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { EmailLoginDto } from './dto/local.dto';
import * as bcrypt from 'bcrypt';
import { PhoneLoginDto } from './dto/phone.dto';
import { GoogleAuthDto } from './dto/google.dto';
import { FacebookAuthDto } from './dto/facebook.dto';
import { AdminAuthDto } from './dto/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async logInViaEmail(emailoginDto: EmailLoginDto) {
    const user = await this.userService.getUserByEmail(emailoginDto.email);
    if (!user) {
      throw new NotFoundException(
        `User with ${emailoginDto.email} email doesn't exist`,
      );
    }
    const passMatch = await bcrypt.compare(
      emailoginDto.password,
      user.password,
    );
    if (user && passMatch === true) {
      const payloadForToken = { email: user.email, id: user.id };
      const token = this.jwtService.sign(payloadForToken);
      return { accessToken: token, email: user.email, id: user.id };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  async loginViaPhone(phoneLoginDto: PhoneLoginDto) {
    const user = await this.userService.getUserByPhoneNumber(
      phoneLoginDto.phone,
    );
    if (user && user.firebaseAccessToken) {
      const payloadForToken = { phone: user.phone, id: user.id };
      const token = this.jwtService.sign(payloadForToken);
      return {
        accessToken: token,
        phone: user.phone,
        id: user.id,
        isExistingUser: true,
      };
    } else if (!user) {
      return {
        isExistingUser: false,
        isEligible: true,
      };
    }
  }

  async authViaGoogle(googleAuthDto: GoogleAuthDto) {
    const user = await this.userService.getUserByEmail(googleAuthDto.email);
    if (user && user.googleAccessToken) {
      const payloadForToken = { email: user.email, id: user.id };
      const token = this.jwtService.sign(payloadForToken);
      return {
        accessToken: token,
        email: user.email,
        id: user.id,
        isExistingUser: true,
      };
    } else if (!user) {
      return {
        isExistingUser: false,
        isEligible: true,
      };
    } else {
      throw new UnauthorizedException(
        `There is already a user registered with ${googleAuthDto.email}, and was not registred using Google, please try to sign in using your email and password.`,
      );
    }
  }
  async authViaFacebook(fbAuthDto: FacebookAuthDto) {
    const user = await this.userService.getUserByEmail(fbAuthDto.email);
    if (user && user.fbAccessToken) {
      const payloadForToken = { email: user.email, id: user.id };
      const token = this.jwtService.sign(payloadForToken);
      return {
        accessToken: token,
        email: user.email,
        id: user.id,
        isExistingUser: true,
      };
    } else if (!user) {
      return {
        isExistingUser: false,
        isEligible: true,
      };
    } else {
      throw new UnauthorizedException(
        `There is already a user registered with ${fbAuthDto.email}, and was not registred using Facebook, please try to sign in using your email and password.`,
      );
    }
  }

  async adminAuth(adminAuthDto: AdminAuthDto) {
    const adminEmail = process.env.AMARDESIGNER_ADMIN_EMAIL;
    const adminPassword = process.env.AMARDESIGNER_ADMIN_PASSWORD;
    if (
      adminAuthDto.email === adminEmail &&
      adminAuthDto.password === adminPassword
    ) {
      const payloadForToken = {
        email: adminEmail,
        id: 0,
        password: adminPassword,
      };
      const token = this.jwtService.sign(payloadForToken);
      return {
        accessToken: token,
        email: adminEmail,
        id: 0,
      };
    } else {
      throw new UnauthorizedException('Invalid Admin Credentials!');
    }
  }
}
