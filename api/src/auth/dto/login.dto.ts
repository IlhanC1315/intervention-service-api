import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";

import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

    @ApiProperty({ example: 'jean@example.com', description: "Email de l'utilisateur" })
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
    password!: string;

}