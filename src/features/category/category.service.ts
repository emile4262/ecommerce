import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/common/config/Prisma.service';

@Injectable()
export class CategoryService {

constructor(
   private readonly prisma: PrismaService
  ){}

  async createCategory( data: CreateCategoryDto): Promise<Category> {
      const existingCategory = await this.prisma.category.findFirst({
        where:  {name: data.name},
      });
      if (existingCategory) {
        throw new NotFoundException(`Une categories avec le nom "${data.name}" existe déjà.`,);
      }
      const category = await this.prisma.category.create({
        data:{
          name: data.name,
          createdAt: new Date()
        },
      });
      return category
    }

    async findAllCategory() {
      return this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        }
      })
    }

  
    async getCategoryById( id: string){
      const category = await this.prisma.category.findUnique({
        where: {id},
        select: {
          id: true, 
          name: true, 
          createdAt: true
        },
      });
      if (!category){
        throw new NotFoundException("cette categories n'existe pas")
      }
      return category
    }
  
  async updateCategory(id : string, data: UpdateCategoryDto){
    const category = await this.prisma.category.findUnique({
      where: {id},
    });

    if (!category) {
      throw new NotFoundException("cette categories n'existe pas")
    }
    else {
      const UpdateCategory = await this.prisma.category.update({
        where: {id},
        data: { ...data, updatedAt: new Date()},
        select: {
          id : true,
          name:true,
          createdAt: true
        },
      });
      return UpdateCategory
    }

  }


 async deleteCategory(id: string) {
  const deleteCategory = await this.prisma.category.deleteMany({
    where: {id},
  });

  if (deleteCategory.count === 0) {
    throw new NotFoundException("aucune categories avec cet id n'existe pas")
  };
 return {message: "category supprimé avec succès"}
 }
}
