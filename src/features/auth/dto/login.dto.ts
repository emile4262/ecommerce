import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {

  @ApiProperty({ example: 'email', description: 'entrez votre email' })  
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "Email de l'utilisateur" })
  email: string;

  @ApiProperty({ example: 'password', description: 'entrez votre mot de passe' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  password: string;

//   @IsString()
//   @IsOptional()
//   user_agent: string;
}
