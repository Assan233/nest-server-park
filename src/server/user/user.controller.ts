import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('info')
  getUserInfo() {
    return 'This action returns user info';
  }
}
