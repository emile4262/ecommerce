import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { PrismaModule } from './common/config/Prisma.module';
import { PrismaService } from './common/config/Prisma.service';
import { AuthModule } from './features/auth/auth.module';


@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [AppController ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
