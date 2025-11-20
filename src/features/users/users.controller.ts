import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth-jwt/jwt-auth.guard';
import { UserRole } from 'src/common/enum/role.decorateur';
import { Roles } from 'src/common/role.guard/public.decorateur';
import { RolesGuard } from 'src/common/role.guard/role.guard';
import { IsOptional } from 'class-validator';
import { SeachDto } from '../products/dto/search.dto';
import { get } from 'http';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  getAllUsers(@Query() query: SeachDto) {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('create')
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Patch('update/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS)
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(id, data);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('put/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.USERS)
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

}
