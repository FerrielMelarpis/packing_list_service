import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class UpdatePackingItemDto {
  @ApiProperty({
    description: 'The name of the item',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The quantity of the item',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'The ID of the list the item belongs to',
  })
  @IsUUID()
  @IsString()
  @IsOptional()
  listId?: string;
}
