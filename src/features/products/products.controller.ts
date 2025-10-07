import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/role.guard/public.decorateur';
import { UserRole } from 'src/common/enum/role.decorateur';
import { RolesGuard } from 'src/common/role.guard/role.guard';
import { JwtAuthGuard } from 'src/common/auth-jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SeachDto } from './dto/search.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

   @Get('all')
   @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de la page',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page",
  })
  @ApiPropertyOptional()
  @IsOptional()
  @ApiQuery({
    name: 'dateCreationDebut',
    required: false,
    type: String,
    description: 'Date de création - début (YYYY-MM-DD)',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @ApiQuery({
    name: 'dateCreationFin',
    required: false,
    type: String,
    description: 'Date de création - fin (YYYY-MM-DD)',
  })
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   findProducts(@Query() query: SeachDto){
    return this.productsService.findAllProducts(query)
   }

   @Get(':id')
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   getProductsById(@Param('id') id: string ) {
    return this.productsService.getProductsById(id)
   }

   @Patch('update/:id')
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   updateProducts(@Param('id') id: string, @Body()data: UpdateProductDto){
    return this.productsService.updateProducts(id, data)
   }

   @Delete('delete/:id')
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   deleteProducts(@Param('id') id: string ){
    return this.productsService.deleteProducts(id)
   }
}
