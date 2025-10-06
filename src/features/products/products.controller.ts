import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/role.guard/public.decorateur';
import { UserRole } from 'src/common/enum/role.decorateur';
import { RolesGuard } from 'src/common/role.guard/role.guard';
import { JwtAuthGuard } from 'src/common/auth-jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   findProducts(){
    return this.productsService.findAllProducts()
   }

   @Get(':id')
   @ApiBearerAuth()
   @UseGuards(JwtAuthGuard, RolesGuard) 
   @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS) 
   getProductsById(@Param('id') id: string) {
    return this.productsService.getProductById(id)
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
