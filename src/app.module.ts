import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { PrismaModule } from './common/config/Prisma.module';
import { PrismaService } from './common/config/Prisma.service';
import { AuthModule } from './features/auth/auth.module';
import { ProductsService } from './features/products/products.service';
import { ProductsModule } from './features/products/products.module';


@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ProductsModule],
  controllers: [AppController ],
  providers: [AppService, PrismaService, ProductsService],
})
export class AppModule {}
