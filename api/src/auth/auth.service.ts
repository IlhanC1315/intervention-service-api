import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Company } from 'generated/prisma';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async register(dto: RegisterDto, ipAddress: string | null): Promise<{ access_token: string }> {
        //Verification que l'email n'existe pas 
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email: dto.email }
        })
        if(existingUser) throw new ConflictException('Email déja utilisé');

        //Hasher le mot de passe le 10 = nombre de rounds de hashage (standard)
        const passwordHash: string = await bcrypt.hash(dto.password, 10)

        //creation du user + company en une transaction
        const user = await this.prisma.client.$transaction(async (tx) => {
            const company: Company = await tx.company.create({
                data: {
                    name: dto.companyName,
                    siret: dto.siret,
                    phone: dto.phone,
                    email: dto.companyEmail,
                    city: dto.city,
                    zipCode: dto.zipCode,
                    country: dto.country ?? 'France'
                }
            });

            const newUser = await tx.user.create({
                data: {
                    companyId: company.id,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    passwordHash,
                    role: 'PATRON',
                    consentGiven: dto.consentGiven,
                    consentGivenAt: new Date(),
                }
            });

            await tx.consentLog.create({
                data: {
                    userId: newUser.id,
                    type: 'CGU',
                    version: '1.0',
                    ipAddress: ipAddress
                }
            });

            return newUser;
        }).catch((error) => {
            if(error.code === 'P2002') {
                throw new ConflictException('Email ou Siret déja utilisé');
            }
            throw new InternalServerErrorException('Erreur lors de la création du compte');
        });

        // génération du JWT token
        const token: string = this.jwt.sign({
            sub: user.id,
            role: user.role,
            companyId: user.companyId
        });

        // retourner le token
        return { access_token: token };
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        // cherche l'utilisateur par email
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email: dto.email }
        });
        if(!existingUser) throw new UnauthorizedException('Identifiants incorrects');

        // compare le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(dto.password, existingUser.passwordHash)
        if (!isMatch) throw new UnauthorizedException('Identifiants incorrects');

        // génération du JWT token

        const token: string = this.jwt.sign({
            sub: existingUser.id,
            role: existingUser.role,
            companyId: existingUser.companyId
        });

        return { access_token: token };
    }

}
