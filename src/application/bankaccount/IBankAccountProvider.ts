import { IPayoutRequestModel, PayoutResponseModel } from './model/payoutRequestModel';
import { Token } from 'typedi';
import { GenerateBankAccountModel, GenerateBankAccountResponse } from './model/generateBankAccountModel';
export interface IBankAccountProvider {
  generateBankAccount(model: GenerateBankAccountModel): Promise<GenerateBankAccountResponse>;
  payout(model: IPayoutRequestModel): Promise<PayoutResponseModel>;
}

export const IBankAccountProviderToken = 'ibankaccount.provider';
