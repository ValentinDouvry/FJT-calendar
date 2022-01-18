import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({ message: "l'email doit être un email valide" })
  @IsString({ message: "L'email doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "L'email ne doit pas être vide" })
  email: string;

  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit faire au minimun 6 carateres',
  })
  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vie' })
  password: string;
}
