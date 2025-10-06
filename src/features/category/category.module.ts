import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/common/config/Prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ CategoryModule, ConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService]
})
export class CategoryModule {}
