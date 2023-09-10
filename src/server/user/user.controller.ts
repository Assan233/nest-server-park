import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('info')
  @HttpCode(200)
  getUserInfo() {
    return {
      code: 200,
      message: 'This action returns user info',
    };
  }
}
