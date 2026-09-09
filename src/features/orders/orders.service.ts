// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateOrderDto, CreateOrderDto } from './dto/update-order.dto';
// import { PrismaService } from 'src/common/config/Prisma.service';

// @Injectable()
// export class OrdersService {
//   constructor( private readonly prisma: PrismaService
//   ) {}
  
//  async create(data: CreateOrderDto) {
//     return this.prisma.$transaction(async (tx) => {
//       const product = await tx.products.findUnique({
//         where: { id: data.productId },
//       });

//       if (!product) {
//         throw new BadRequestException('Produit introuvable');
//       }

//       // Vérification stock
//       if (product.stockInitial < data.quantity) {
//         throw new BadRequestException(
//           `Stock insuffisant. Disponible: ${product.stockInitial}`,
//         );
//       }

//       // Mise à jour stock
//       await tx.products.update({
//         where: { id: product.id },
//         data: {
//           stockInitial: product.stockInitial - data.quantity,
//         },
//       });

//       const total = product.prix * data.quantity;

//       // Création commande
//       return tx.orders.create({
//         data: {
//           productId: data.productId,
//           quantity: data.quantity,
//           total,
//           status: 'PENDING',
//           createdAt: new Date(),
//         },
//     });

//     });
//   }

//   findAll() {
//     return `This action returns all orders`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} order`;
//   }

//   update(id: number, updateOrderDto: UpdateOrderDto) {
//     return `This action updates a #${id} order`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} order`;
//   }
// }
