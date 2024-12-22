import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePackingListDto {
  @ApiProperty({
    description: 'The name of the list',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
