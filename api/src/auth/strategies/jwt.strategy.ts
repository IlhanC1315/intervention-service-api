import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma';

// Type du payload JWT
interface JwtPayload {
    sub: string;
    role: Role;
    companyId: string;
    iat: number;  // issued at — date de création du token
    exp: number;  // expiration — date d'expiration du token
}

// Type de ce qu'on retourne dans req.user
interface AuthUser {
    id: string;
    role: Role;
    companyId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            // ou chercher le token dans la requete (ici dans le header)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // la clé secrète pour vérifier que le token n'a pas été falsifié
            secretOrKey: process.env.JWT_SECRET as string,
            // rejette les token expirés
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const user = await this.prisma.client.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                role: true,
                companyId: true,
                isActive: true,
            }
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Accès refusé');
        }

        return {
            id: user.id,
            role: user.role,
            companyId: user.companyId,
        };
    }
}