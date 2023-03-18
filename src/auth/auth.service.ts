import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('No user registered with ' + email);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (user && passwordMatch === true) {
      return { email: user.email, id: user.id };
    } else {
      throw new UnauthorizedException('Invalid Credentials!');
    }
  }

  async LogIn(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        return {
          user: { id: user.id, email: user.email },
          message: 'Logged In Successfully!',
        };
      }
      throw new UnauthorizedException('Invalid Credentials!');
    }
    throw new NotFoundException('No Registered User With Following Email!');
  }
}
