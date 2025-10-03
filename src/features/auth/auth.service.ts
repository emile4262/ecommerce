import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/config/Prisma.service';
import { UserRole } from '../../common/enum/role.decorateur';
import { profile } from 'console';
import { User } from '../users/entities/user.entity';
import { randomInt } from 'crypto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import * as nodemailer from 'nodemailer';



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
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Email incorrect' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Mot de passe incorrect' };
    }

    // Définir le rôle (exemple simple)
    const userRole = email === 'brou@gmail.com' ? 'ADMIN' : user.role ?? 'USER';

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
      data: { refreshToken: refresh_token },
    });

    // Nettoyer l’objet utilisateur
    const { password: _, refreshToken: __, ...userInfo } = user;

    return {
      success: true,
      message: 'Connexion réussie',
      access_token,
      refresh_token,
      // user: userInfo,
    };
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de la connexion: ${error.message}`,
    };
  }
}

  // recupérer le profil utilisateur
 async getAllProfiles(): Promise<Partial<User>[]> {
    return this.prisma.users.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

// modifier mot de passe

 // Méthode pour rétrograder un admin en utilisateur normal
 async sendOtp(dto: ResetPasswordDto) {
  const user = await this.prisma.users.findUnique({ where: { email: dto.email } });

  if (!user) {
    throw new NotFoundException('Utilisateur introuvable');
  }

  //  Limite de 1 fois par mois pour les utilisateurs non-admin
  if (user.role !== 'admin' && user.lastPasswordResetAt) {
  const now = new Date();
  const lastReset = new Date(user.lastPasswordResetAt);

  // Ajouter 7 jours à la dernière réinitialisation
  const nextAllowed = new Date(lastReset.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (now < nextAllowed) {
    const daysLeft = Math.ceil((nextAllowed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    throw new BadRequestException(
      `Vous avez déjà réinitialisé votre mot de passe cette semaine. Veuillez réessayer dans ${daysLeft} jour(s).`
    );
  }
}


  const otp = randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expire dans 10 minutes

  await this.prisma.users.update({
    where: { email: dto.email },
    data: {
      otp,
      otpExpires,
      lastPasswordResetAt: user.role !== 'admin' ? new Date() : user.lastPasswordResetAt, // mise à jour uniquement si non admin
    },
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Réinitialisation du mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
              <tr>
                <td align="center" style="font-size: 24px; font-weight: bold; color: #333333;">
                  Réinitialisation du mot de passe 🔐
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0; font-size: 16px; color: #555555;">
                  Bonjour ${user.lastName || 'utilisateur'},
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555555;">
                  Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <div style="font-size: 28px; font-weight: bold; color: #007bff; background-color: #e9f0fb; padding: 12px 24px; display: inline-block; border-radius: 4px;">
                    ${otp}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #999999;">
                  Ce code expirera dans <strong>10 minutes</strong>.
                </td>
              </tr>
              <tr>
                <td style="padding-top: 20px; font-size: 14px; color: #999999;">
                  Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.
                </td>
              </tr>
              <tr>
                <td style="padding-top: 30px; font-size: 14px; color: #555555;">
                  Merci,<br/>
                  <p> L'équipe Boutique SARAH </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Support Boutique" <${process.env.EMAIL_USER}>`,
    to: dto.email,
    subject: 'Réinitialisation de mot de passe - Code OTP',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email OTP envoyé à ${dto.email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new BadRequestException("Impossible d'envoyer l'OTP par e-mail");
  }

  return {
    message: 'OTP envoyé à votre email',
  };
}

  /**
   * Réinitialise le mot de passe avec l'OTP
   */
   async resetPasswordWithOtp(dto: VerifyOtpDto) {
    // Nettoyer les données d'entrée
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    // Récupérer l'utilisateur avec son OTP
    const user = await this.prisma.users.findUnique({
      where: { email: email }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }


    // Vérifier que l'OTP existe et n'est pas expiré
    if (!user.otp || !user.otpExpires) {
      throw new BadRequestException('Aucun OTP généré pour cet utilisateur');
    }

    if (user.otpExpires < new Date()) {
      throw new BadRequestException('OTP expiré');
    }

   // Comparaison plus robuste de l'OTP
    if (user.otp.trim() !== otp) {
      throw new BadRequestException(`OTP invalide - Reçu: "${otp}", Attendu: "${user.otp}"`);
    }    

    
    // Valider le nouveau mot de passe (ajoutez vos règles de validation)
    if (!dto.newPassword || dto.newPassword.length < 8) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères');
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(dto.newPassword, 12); // 12 rounds pour plus de sécurité

    try {
      // Mettre à jour le mot de passe et supprimer l'OTP
      await this.prisma.users.update({
        where: { email: dto.email },
        data: { 
          password: hashedPassword,
          otp: null, // Supprimer l'OTP utilisé
          otpExpires: null, // Supprimer la date d'expiration
          updatedAt: new Date() // Mettre à jour la date de modification
        },
      });
      console.log('Mot de passe réinitialisé avec succès pour:', email);


      return { 
        message: 'Mot de passe réinitialisé avec succès' 
      };

    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
    }
  }
}
