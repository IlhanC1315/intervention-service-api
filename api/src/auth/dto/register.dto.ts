import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    MinLength,
    MaxLength,
    Matches,
    IsNumberString,
    Length,
    IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty({ example: 'Jean', description: 'Prenom' })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    firstName!: string;

    @ApiProperty({ example: 'DeLaCroix', description: 'Nom' })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    lastName!: string;

    @ApiProperty({ example: 'jean@example.com', description: 'Email' })
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsEmail({}, { message: 'Email invalide' })
    @MinLength(3, { message: 'Minimum 3 caractères' })
    @MaxLength(50, { message: 'Maximum 50 caractères' })
    email!: string;

    @ApiProperty({ example: 'Password1', description: 'Mot de passe' })
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(8, { message: 'Minimum 8 caractères' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Doit contenir majuscule, minuscule, chiffre et caractère spécial'
    })
    password!: string;

    @ApiProperty({ example: 'PlacoEnterprise', description: "Nom de l'entreprise" })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères '})
    @MaxLength(50, { message: 'Maximum 50 caractères'})
    companyName!: string;

    @ApiProperty({ example: 'siret', description: "Numéro de siret" })
    @Transform(({ value }) => value.trim())
    @IsNumberString({}, { message: 'Le siret doit contenir uniquement des chiffres' })
    @Length(14, 14, { message: 'Le SIRET doit contenir exactement 14 chiffres' })
    siret!: string;

    @ApiPropertyOptional({ example: '+33612345678', description: "Nunméro de téléphone" })
    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @Matches(/^(\+33|0)[1-9](\d{8})$/, { message: 'Numéro de téléphone invalide' })
    phone?: string;

    @ApiPropertyOptional({ example: 'placoEntreprise@example.com', description: "Email de l'entreprise" })
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsOptional()
    @IsEmail({}, { message: 'Email invalide' })
    @MinLength(3, { message: 'Minimum 3 caractères '})
    @MaxLength(50, { message: 'Maximum 50 caractères'})
    companyEmail?: string;

    @ApiPropertyOptional({ example: '5 hameau de la bigotte', description: "Adresse de l'entreprise" })
    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères '})
    @MaxLength(50, { message: 'Maximum 50 caractères'})
    address?: string;

    @ApiProperty({ example: 'Marseille', description: "Ville" })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères '})
    @MaxLength(50, { message: 'Maximum 50 caractères'})
    city!: string;

    @ApiProperty({ example: '13015', description: "Code postal" })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @Matches(/^\d{5}$/, { message: 'Code postal invalide — doit contenir 5 chiffres' })
    zipCode!: string;

    @ApiProperty({ example: 'France', description: "Pays" })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Obligatoire' })
    @IsString({ message: 'Doit être un texte' })
    @MinLength(3, { message: 'Minimum 3 caractères '})
    @MaxLength(50, { message: 'Maximum 50 caractères'})
    country!: string;

    @ApiProperty({ example: true, description: 'Acceptation des CGU et politique de confidentialité' })
    @IsBoolean({ message: 'Doit être un booléen' })
    @IsNotEmpty({ message: 'Vous devez accepter les CGU' })
    @Transform(({ value }) => value === 'true' || value === true)
    consentGiven!: boolean;

}