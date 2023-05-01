import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { PayoutDestinationModel } from './payoutRequestModel';

export class BankTransferModel {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  walletId?: string;
  @IsString()
  currencyCode?: string;
  @IsString()
  userId?: string;
  @IsNotEmpty()
  narration: string;
  @IsNotEmptyObject()
  @IsNotEmpty()
  destination: PayoutDestinationModel;
}
