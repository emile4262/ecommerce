import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/config/Prisma.service';
import { UserRole } from '../../common/role.guard/role.decorateur';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}


  // Connexion avec gestion du blocage et génération des tokens
   
  async login(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    access_token?: string;
    refresh_token?: string;
    user?: any;
  }> {
    try {
      const user = await this.prisma.users.findUnique({ where: { email } });

      if (!user) {
        return { success: false, message: 'Email incorrect' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Mot de passe incorrect' };
      }

      // Seul 'brou@gmail.com' est considéré comme admin
      const userRole = email === 'brou@gmail.com' ? 'admin' : 'user';

      const payload = {
        sub: user.id,
        email: user.email,
        role: userRole,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      });

      const refresh_token = this.jwtService.sign(
        { sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '2d',
        }
      );
      // Sauvegarder le refresh token en base
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          refreshToken: refresh_token,
        },
      });

      // Retourner les informations utilisateur sans le mot de passe
      const { password: _, refreshToken: __, ...userInfo } = user;

      return {
        success: true,
        message: 'Connexion réussie',
        access_token,
        refresh_token,
        
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la connexion: ${error.message}`,
      };
    }
  }
}
