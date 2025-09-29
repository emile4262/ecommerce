import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core'; // Ajouter Reflector
import { HttpException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../role.guard/public.decorateur';
import { UsersService } from 'src/features/users/users.service';

// Importer IS_PUBLIC_KEY

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,

    private reflector: Reflector, // Injection du Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      console.error('Erreur de vérification du token JWT:', error);
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    const user = await this.userService.getUserById(decoded.sub);

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // const userAgent = decoded.user_agent;

    // if (userAgent !== user.user_agent) {
    //   throw new HttpException(
    //     {
    //       message: 'User agent non valide',
    //     },
    //     410,
    //   );
    // }

    request.user = user;
    return true;
  }
}
