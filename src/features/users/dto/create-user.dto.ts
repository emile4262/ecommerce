import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    static accesstoken: string;
  static mustChangePassword: boolean;
  static password: any;
    static firstname(firstname: string, linktoken: string): string {
      throw new Error('Method not implemented.');
    }

    @ApiProperty({ example: 'John', description: 'entrez votre nom' })
    @IsString()
    @MinLength(3)
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'entrez votre prénom' })
    @IsString()
    @MinLength(3)
    lastName: string;

    @ApiProperty({ example: 'email', description: 'entrez votre email' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password', description: 'entrez votre mot de passe' })
    @IsString()
    @MinLength(6)
    password: string;
    
    isAdmin: boolean;

}
