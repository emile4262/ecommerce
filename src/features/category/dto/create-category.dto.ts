import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto {

    @ApiProperty({ example: 'le nom du categories ', description: 'entrez la categories' })
    @IsString()
    name : string

}
