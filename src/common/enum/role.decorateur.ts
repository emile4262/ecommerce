import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',  
  ADMIN = 'ADMIN',
  USERS = "USERS",


}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

