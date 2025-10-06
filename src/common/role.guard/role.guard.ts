import { 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../enum/role.decorateur';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est requis, on autorise
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // console.log('Requête utilisateur:', user);
    // console.log('Rôles requis:', requiredRoles);

    if (!user) {
      throw new UnauthorizedException('Accès interdit : utilisateur non authentifié');
    }

    if (!user.role) {
      throw new ForbiddenException('Accès interdit : rôle utilisateur manquant');
    }

    const userRole = user.role.toUpperCase() as UserRole;
    // console.log(`Rôle de l'utilisateur: ${userRole}`);

    // Vérification que le rôle est valide
    if (!Object.values(UserRole).includes(userRole)) {
      throw new ForbiddenException('Accès interdit : rôle utilisateur invalide');
    }

    const hasRole = requiredRoles.some(role => role === userRole);

    if (!hasRole) {
      throw new ForbiddenException('Accès interdit : rôle insuffisant');
    }

    return true;
  }
}
