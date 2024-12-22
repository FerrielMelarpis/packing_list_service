import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePackingListDto {
  @ApiProperty({
    description: 'The name of the list',
  })
  @IsString()
  name: string;
}
