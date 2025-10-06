import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createProduct(data: CreateProductDto): Promise<Products> {
  // Vérifier si la catégorie existe
  const category = await this.prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new NotFoundException(
      `Catégorie avec l'ID ${data.categoryId} non trouvée`,
    );
  }
  const Users = await this.prisma.users.findUnique({
    where: {id: data.usersId},
  })

  if (!Users) {
     throw new NotFoundException(`utilisateur avec l'ID ${data.usersId} non trouvée`)
  }

  // Vérifier le stock initial
  if (data.stockInitial <= 0) {
    throw new BadRequestException(
      'Le produit doit avoir un stock initial supérieur à 0',
    );
  }

  // Vérifier si un produit avec le même nom existe déjà
  const existingProduct = await this.prisma.products.findFirst({
    where: { name: data.name },
  });

  if (existingProduct) {
    throw new BadRequestException(
      `Un produit avec le nom "${data.name}" existe déjà.`,
    );
  }

  // Créer le produit
  const product = await this.prisma.products.create({
    data: {
      name: data.name,
      description: data.description,
      prix: data.prix,
      stockInitial: data.stockInitial,
      createdAt: new Date(),
      category: {
        connect: { id: data.categoryId },
      },
      user: {
        connect: { id: data.usersId },
      },
    },
  });

  return product;
}


  async  findAllProducts() {

    return this.prisma.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        prix: true,
        stockInitial: true,
        categoryId: true,
        userId:true
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
        stockInitial: true,
        categoryId: true,
        userId:true
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
    });
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
        stockInitial: true,
        categoryId: true,
        userId:true


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
