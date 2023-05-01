import { WalletService } from './persistence/services/iwallet.service';
import { walletServiceInjectionToken } from '@/application/wallet/IwalletService';
import { TransactionService } from './persistence/services/TransactionService';
import { transactionServiceToken } from './../application/transaction/ItransactionService.interface';
import { IBankAccountProvider, IBankAccountProviderToken } from '@/application/bankaccount/IBankAccountProvider';
import { IBankAccountServiceToken } from '../application/bankaccount/IBankaccountService';
import { Container, Service } from 'typedi';
import { logger } from '@utils/logger';
import { BankAccountService } from './persistence/services/bankAccount.service';
import { RevenBankService } from './external-api-service/revenbank/RevenBankService';

export const SetupInfrastructureDependencies = () => {
  try {
    Container.set(IBankAccountProviderToken, new RevenBankService());
    const ibankAccountProvider: IBankAccountProvider = Container.get<IBankAccountProvider>(IBankAccountProviderToken);
    Container.set(IBankAccountServiceToken, new BankAccountService(ibankAccountProvider));
    Container.set(transactionServiceToken, Container.get(TransactionService));
    Container.set(walletServiceInjectionToken, Container.get(WalletService));
  } catch (error) {
    logger.error(error);
  }
};
