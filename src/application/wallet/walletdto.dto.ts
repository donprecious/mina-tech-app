import { IsNotEmpty, IsString } from 'class-validator';
export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  userid: string;
  @IsString()
  @IsNotEmpty()
  currencyCode: string;
}
