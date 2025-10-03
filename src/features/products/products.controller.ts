import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

   @Get('all')
   findProductsService(){
    return this.productsService.findAllProducts()
   }

   @Get(':id')
   getProductsById(@Param('id') id: string) {
    return this.productsService.getProductById(id)
   }

   @Patch('update/:id')
   updateProducts(@Param('id') id: string, @Body()data: UpdateProductDto){
    return this.productsService.updateProducts(id, data)
   }

   @Delete('delete/:id')
   deleteProducts(@Param('id') id: string ){
    return this.productsService.deleteProducts(id)
   }
}
