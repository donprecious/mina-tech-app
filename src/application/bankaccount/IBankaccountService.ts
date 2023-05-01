import { IBankAccounts } from '@/domain/interfaces/bankaccounts.interface';
import { BankTransferModel } from './model/bankTransferModel';
import { GenerateBankAccountDto } from './model/generateBankAccount.dto';
import { PayoutDestinationModel } from './model/payoutRequestModel';

export interface IBankAccountService {
  generateBankAccount(generateBankAccountDto: GenerateBankAccountDto): Promise<IBankAccounts>;
  getBankAccount(parms: { currencyCode?: string; accountNo?: string; requestedAmount?: number }): Promise<IBankAccounts>;
  bankTransferPayout(model: BankTransferModel);
}

export const IBankAccountServiceToken = 'ibankaccount.service.token';
