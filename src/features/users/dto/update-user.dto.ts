import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto  {



        @ApiProperty({ example: 'John', description: 'entrez votre nom' })
        @IsString()
        @MinLength(3)
        @Optional()
        firstName: string;

    
        @ApiProperty({ example: 'Doe', description: 'entrez votre prénom' })
        @IsString()
        @MinLength(3)
        @Optional()
        lastName: string;
    
        @ApiProperty({ example: 'email', description: 'entrez votre email' })
        @IsString()
        @IsEmail()
        @Optional()
        email: string;
}
