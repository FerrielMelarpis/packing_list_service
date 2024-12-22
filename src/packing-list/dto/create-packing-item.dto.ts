import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreatePackingItemDto {
  @ApiProperty({
    description: 'The name of the item',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The quantity of the item',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity: number;
}
