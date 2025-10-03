
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/role.guard/auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Users } from 'generated/prisma';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

   // Connexion - PUBLIC
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

//  recuperer le profil de l'utilisateur connecté

  @Get('profile/me') 
  @ApiOperation({ summary: 'Récupérer son propre profil' })
  async getAllProfiles(@Param() req: Request) {
    return this.authService.getAllProfiles(); 
  }

// Endpoints publics (sans authentification)
@Post('forgot-password')
// @UseGuards(JwtAuthGuard, RolesGuard) 
// @Roles(Role.admin, Role.user)
@ApiOperation({ summary: 'Demander un OTP pour réinitialiser le mot de passe (public)' })
async forgotPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.sendOtp(dto);
}

@Post('reset-password')
// @UseGuards(JwtAuthGuard, RolesGuard) 
// @Roles(Role.admin, Role.user)
@ApiOperation({ summary: 'Réinitialiser le mot de passe avec OTP (public)' })
async resetPassword(@Body() dto: VerifyOtpDto) {
  return this.authService.resetPasswordWithOtp(dto);
}
 

}
