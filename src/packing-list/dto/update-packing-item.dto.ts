import { IsOptional, IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class UpdatePackingItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsUUID()
  @IsString()
  @IsOptional()
  listId?: string;
}
