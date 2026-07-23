import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    MinLength,
    MaxLength,
    Matches,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UpdateCompanyDto {

    @ApiPropertyOptional({ example: 'PlacoEnterprise', description: "Nom de l'entreprise" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères ' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    name?: string;

    @ApiPropertyOptional({ example: '+33612345678', description: "Nunméro de téléphone" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @Matches(/^(\+33|0)[1-9](\d{8})$/, { message: 'Numéro de téléphone invalide' })
    phone?: string;

    @ApiPropertyOptional({ example: 'placoEntreprise@example.com', description: "Email de l'entreprise" })
    @Transform(({ value }) => value?.trim().toLowerCase())
    @IsOptional()
    @IsEmail({}, { message: 'Email invalide' })
    @MinLength(3, { message: 'Minimum 3 caractères ' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    email?: string;

    @ApiPropertyOptional({ example: '5 hameau de la bigotte', description: "Adresse de l'entreprise" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères ' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    address?: string;

    @ApiPropertyOptional({ example: 'Marseille', description: "Ville" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères ' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    city?: string;

    @ApiPropertyOptional({ example: '13015', description: "Code postal" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @Matches(/^\d{5}$/, { message: 'Code postal invalide — doit contenir 5 chiffres' })
    zipCode?: string;

    @ApiPropertyOptional({ example: 'France', description: "Pays" })
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères ' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    country?: string;

}