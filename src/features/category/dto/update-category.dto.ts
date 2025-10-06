import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto  {
     @ApiProperty({ example: 'le nom du categories ', description: 'entrez la categories' })
     @IsString()
        name : string
}
