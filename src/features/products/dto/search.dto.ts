import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SeachDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'recherche de la classe' })
  search?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Numéro de page' })
  page: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'limit' })
  limit: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de création - début (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  dateCreationDebut?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date de création - fin (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  dateCreationFin?: string;
}
