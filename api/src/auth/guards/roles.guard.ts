import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles requis définis par @Roles() sur la route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si pas de @Roles() sur la route → tout le monde peut accéder
    if (!requiredRoles) return true;

    // Récupère l'utilisateur depuis req.user (mis par JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // Vérifie que l'utilisateur a le bon rôle
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Vous n\'avez pas les permissions nécessaires');
    }

    return true;
  }
}