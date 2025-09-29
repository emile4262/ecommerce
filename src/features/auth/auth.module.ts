
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/features/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/config/Prisma.service';

@Module({
  imports: [ AuthModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mon_secret_jwt_par_defaut',
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
  
})
export class AuthModule {}
