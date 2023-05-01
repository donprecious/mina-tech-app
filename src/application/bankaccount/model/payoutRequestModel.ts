import { IsNotEmpty } from 'class-validator';

export interface IPayoutRequestModel {
  userid: string;
  currencyCode: string;
  amount: number;
  payoutType: 'banktransfer';
  destination: PayoutDestinationModel;
  referenceNo: string;
  narration: string;
}

export class PayoutDestinationModel {
  @IsNotEmpty()
  bankAccountNumber: string;
  @IsNotEmpty()
  accountName: string;
  @IsNotEmpty()
  bankName: string;
  @IsNotEmpty()
  bankCode: string;
}

export interface PayoutResponseModel {
  userId: string;
  referenceId: string;
  providerReference: string;
  providerRespoonse: string;
  isSuccess: boolean;
}
