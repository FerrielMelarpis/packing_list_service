import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePackingListDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
