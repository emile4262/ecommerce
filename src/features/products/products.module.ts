import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/common/config/Prisma.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [ProductsModule, ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService]
})
export class ProductsModule {}
