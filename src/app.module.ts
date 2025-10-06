import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { PrismaModule } from './common/config/Prisma.module';
import { PrismaService } from './common/config/Prisma.service';
import { AuthModule } from './features/auth/auth.module';
import { ProductsService } from './features/products/products.service';
import { ProductsModule } from './features/products/products.module';
import { CategoryService } from './features/category/category.service';
import { CategoryModule } from './features/category/category.module';
import { JwtAuthGuard } from './common/auth-jwt/jwt-auth.guard';
import { RolesGuard } from './common/role.guard/role.guard';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';


@Module({
  imports: [ ConfigModule
    .forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule, 
    ProductsModule, 
    CategoryModule
  ],
  controllers: [AppController ],
  providers: [AppService, PrismaService, ProductsService, CategoryService, JwtAuthGuard, RolesGuard],
})
export class AppModule {
  async onModuleInit() {
    const app = await NestFactory.create(AppModule); // Créez une instance de l'application ici

    const config = new DocumentBuilder()
      .setTitle('Mon API NestJS')
      .setDescription('La description de mon API')
      .setVersion('1.0')
      .addBearerAuth() // Si vous utilisez Bearer token pour l'authentification
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Définit la route pour accéder à l'UI Swagger ('/api')

    //   await app.listen(5001); // Assurez-vous que votre application écoute après la configuration de Swagger
  }
}
