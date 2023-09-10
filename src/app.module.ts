import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './server/user/user.module';
import { SocketModule } from './app/rtc/socket/socket.module';

@Module({
  imports: [UserModule, SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
