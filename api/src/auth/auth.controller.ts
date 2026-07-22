import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Connexion utilisateur' })
    @ApiResponse({ status: 200, description: 'Connexion' })
    @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
        return this.authService.login(dto);
    }

    @Post('register')
    @ApiOperation({ summary: "Enregistrement d'utilisateur" })
    @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
    @ApiResponse({ status: 400, description: 'Enregistrement échoué' })
    @ApiResponse({ status: 409, description: 'Email déja utilisé' })
    async register(@Body() dto: RegisterDto): Promise<{ access_token: string }> {
        return this.authService.register(dto)
    }

}
