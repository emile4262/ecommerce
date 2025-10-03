import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PrismaService } from 'src/common/config/Prisma.service';
import { Products } from '@prisma/client';

@Injectable()
export class ProductsService {

constructor( 
  private readonly prisma: PrismaService
) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Products> {
    const { name, description, prix, stockInitial } = createProductDto
    // const existingProduct = await this.prisma.products.findUnique({
    //   where: { name},
    // });
    // if (existingProduct) {
    //   throw new ConflictException ("cet produit n'existe pas ")
    // }


    const products = await this.prisma.products.create({
      data: {
        name,
        description,
        prix,
        stockInitial,
        createdAt: new Date()
      }
    })
    return products
  }

  async  findAllProducts() {

    return this.prisma.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        prix: true,
        stockInitial: true
      },
    });
  }
  
  async getProductById( id: string) {
    const products = await this.prisma.products.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        description: true,
        prix: true,
        stockInitial: true
      },
    });
    if (!products){
      throw new NotFoundException(" cet produit n'existe pas ")
    }
    return products
  }
  
  async updateProducts (id: string, data: UpdateProductDto){
    const products = await this.prisma.products.findUnique({
      where : {id}
    })
    if (!products) {
      throw new NotFoundException("cet produit n'existe pas")
    }
  else {
    const  UpdateProducts = await this.prisma.products.update({
      where: {id},
      data: { ...data, updatedAt: new Date() },
      select: {
        id: true,
        name: true,
        description: true,
        prix: true,
        stockInitial: true


      },
    });

    return UpdateProducts
  } 
  }

async deleteProducts(id : string){
const deleteProducts = await this.prisma.products.deleteMany({
  where: {id},
});

if (deleteProducts.count === 0){
  throw new NotFoundException("aucun produit n'existe avec cet id")
}
return {message: "produit supprimé avec succès"};

}
}
