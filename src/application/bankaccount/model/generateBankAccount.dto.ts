import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class GenerateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
