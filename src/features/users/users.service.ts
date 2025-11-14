import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/config/Prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { Users } from 'generated/prisma';
import { User } from './entities/user.entity';
import { SeachDto } from '../products/dto/search.dto';
import { contains } from 'class-validator';

@Injectable()
export class UsersService {

  
  constructor( private readonly prisma: PrismaService,
     private configService: ConfigService,
  ) {}

  private excludeSensitiveFields(users: Users): Omit<User, 'password' | 'role'> {
    const { password, ...safeUser } = users;
    return safeUser;
  }
  
  
  async  getAllUsers(filterDto:SeachDto ) {

  const { search, limit, page, dateCreationDebut, dateCreationFin } = filterDto;
  const limitNumber = Math.max(1, Number(limit) || 10);
  const pageNumber = Math.max(1, Number(page) || 1);
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  // // Filtre pour supprimer les éléments "deleted"
  // where.deletedAt = { equals: null };

  // // Filtre de date
  if (dateCreationDebut || dateCreationFin) {
    where.createdAt = {};
    if (dateCreationDebut) {
      where.createdAt.gte = new Date(dateCreationDebut);
    }
    if (dateCreationFin) {
      const fin = new Date(dateCreationFin);
      fin.setHours(23, 59, 59, 999);
      where.createdAt.lte = fin;
    }
  }

  // Recherche texte
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      {role: {contains: search, mode: 'insensitive'}}
    ];

    // const searchNumber = Number(search);
    // if (!isNaN(searchNumber)) {
    //   where.OR.push({ prix: searchNumber });
    //   where.OR.push({ stockInitial: searchNumber });
    // }
  } 
    const users = await this.prisma.users.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true, 
        createdAt: true,
        updatedAt: true,
      },
      take: limitNumber,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
    });
    return users
  }

  // generateToken() {
  //   let token = '';
  //   const length = 40; // Longueur du token, vous pouvez la modifier selon vos besoins
  //   for (let i = 0; i < length; i++) {
  //     token += randomInt(0, 10).toString();
  //   }
  //   return token;
  // }

  async getUserById(id: string){
    const users = await this.prisma.users.findUnique({
      where: {id},
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if(!users){
      throw new NotFoundException("l'utilisateur n'existe pas");
    }
   return users
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'role'>> {
    const { email, password, firstName, lastName, role } = createUserDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const isAdmin = email === 'bnandoemile@gmail.com';

    const users = await this.prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date(), 
      },
    });

    return users
  }



  async updateUser(id: string, data: UpdateUserDto) {
  // Si l'utilisateur envoie un nouvel email, on vérifie qu'il n'existe pas déjà
  if (data.email) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('Cet email est déjà utilisé');
    }
  }

  try {
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new NotFoundException("Aucun utilisateur n'existe avec cet id");
  }
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
