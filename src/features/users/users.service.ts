import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/config/Prisma.service';

@Injectable()
export class UsersService {
  constructor( private readonly prisma: PrismaService) {}
  
  async  getAllUsers() {
    return this.prisma.users.findMany();
  }

  async getUserById(id: string){
    const users = await this.prisma.users.findUnique({
      where: {id}
    });
    if(!users){
      throw new NotFoundException("l'utilisateur n'existe pas");
    }
   return users;
  }

  async createUser(data){
    const userExist = await this.prisma.users.findUnique({
      where: {email: data.email},
    });
    if(userExist){
      throw new NotFoundException("l'utilisateur existe déja avec cet email");
    }
    return this.prisma.users.create({
      data,
    })

  }

  async updateUser(id: string, data: UpdateUserDto){
    const users = await this.prisma.users.update({
      where: {id},
      data: {updatedAt: new Date(), ...data},
    })
    if(!users){
      throw new NotFoundException("Aucun utilisateur n'existe avec cet id");
    }
    return users;
  }

async deleteUser(id: string) {
  const result = await this.prisma.users.deleteMany({
    where: { id },
  });

  if (result.count === 0) {
    throw new NotFoundException("Aucun utilisateur n'existe avec cet id");
  }

  return { message: "Utilisateur supprimé avec succès" };
}


}
