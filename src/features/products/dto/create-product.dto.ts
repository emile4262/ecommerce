import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @ApiProperty({example: "le nom du produit", description: "la description du produit"})
    @IsString()
    name: string;

    @ApiProperty({example: "le nom du produit", description: "la description du produit"})
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    prix: number;

    @ApiProperty( )
    @IsNumber()
    stockInitial: number;

    @ApiProperty()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty()
    @IsNotEmpty()
    usersId: string;

    @IsNotEmpty()
    @IsString()
    ProductsId: string;


}
