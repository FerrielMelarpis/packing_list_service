import { IsString } from 'class-validator';

export class UpdatePackingListDto {
  @IsString()
  name: string;
}
