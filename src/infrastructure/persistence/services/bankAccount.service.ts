import { logger } from '@utils/logger';
import { transactionServiceToken } from './../../../application/transaction/ItransactionService.interface';
import { ITransaction } from '@/domain/interfaces/transaction.interface';
import { IWallet } from '@/domain/interfaces/wallets.interface';
import { BadRequestException } from '@/application/exceptions/badRequestException';
import { WalletModel } from './../models/wallets.model';
import { IBankAccountProviderToken } from '@/application/bankaccount/IBankAccountProvider';
import { IBankAccountService } from '../../../application/bankaccount/IBankaccountService';
import { IBankAccounts } from '@/domain/interfaces/bankaccounts.interface';
import { GenerateBankAccountDto } from '../../../application/bankaccount/model/generateBankAccount.dto';
import { Inject, Service, Container } from 'typedi';
import { BankAccountModel } from '@/infrastructure/persistence/models/bankaccounts.model';

import { GenerateBankAccountModel } from '../../../application/bankaccount/model/generateBankAccountModel';
import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { HttpException } from '@/application/exceptions/httpException';
import { IBankAccountProvider } from '@/application/bankaccount/IBankAccountProvider';
import { PayoutDestinationModel } from '@/application/bankaccount/model/payoutRequestModel';
import { v4 as uuidv4 } from 'uuid';
import { ITransactionService } from '@/application/transaction/ItransactionService.interface';
import { TransactionCategoryEnum } from '@/domain/enums/transactionEnums';
import { BankTransferModel } from '@/application/bankaccount/model/bankTransferModel';
@Service()
export class BankAccountService implements IBankAccountService {
  /**
   *
   */
  constructor(@Inject(IBankAccountProviderToken) private bankAccountProvider: IBankAccountProvider) {}

  async generateBankAccount(generateBankAccountDto: GenerateBankAccountDto): Promise<IBankAccounts> {
    const findBankaccount = await BankAccountModel.query().findOne({
      userId: generateBankAccountDto.userId,
      currencyCode: generateBankAccountDto.currencyCode,
      requestedAmount: generateBankAccountDto.amount,
    });
    if (findBankaccount) {
      return findBankaccount;
    }
    const user = await UserModel.query().findOne({ id: generateBankAccountDto.userId });
    if (!user) throw new BadRequestException('User not found');

    const result = await this.bankAccountProvider.generateBankAccount(
      new GenerateBankAccountModel(user.firstname, user.lastname, user.email, user.phoneNumber, user.id, generateBankAccountDto.amount),
    );
    if (!result) throw new HttpException(501, 'Failed to generate bank account');

    const bankAccount = new BankAccountModel();
    bankAccount.setBankAccount(
      user.id,
      result.accountNumber,
      result.accountName,
      result.bankName,
      generateBankAccountDto.currencyCode,
      result.isVirtual,
      result.isTemporary,
      result.bankCode,
    );
    bankAccount.requestedAmount = result.requestedAmount;

    const data = await BankAccountModel.query().insertAndFetch(bankAccount);
    return data;
  }

  async getBankAccount(parms: { currencyCode?: string; accountNo?: string; requestedAmount?: number }): Promise<IBankAccounts> {
    let query = BankAccountModel.query();
    if (parms.currencyCode) {
      query = query.where('currencyCode', parms.currencyCode);
    }
    if (parms.accountNo) {
      query = query.where('accountNumber', parms.accountNo);
    }
    if (parms.requestedAmount) {
      query = query.where('requestedAmount', parms.requestedAmount);
    }
    const result = await query.first();
    return result;
  }

  async bankTransferPayout(params: BankTransferModel) {
    let wallet: IWallet;
    if (params.walletId) {
      wallet = await WalletModel.query().findOne({ id: params.walletId });
    } else {
      if (!params.currencyCode && !params.userId) {
        throw new BadRequestException('currency code and user id is required, or just provide the wallet id ');
      }
      wallet = await WalletModel.query().findOne({ userId: params.userId, currencyCode: params.currencyCode });
    }

    if (!wallet) throw new BadRequestException('wallet not found');
    params.userId = wallet.userId;
    const findUser = await UserModel.query().findOne({ id: params.userId });
    if (!findUser) throw new BadRequestException('user not found');

    if (wallet.amount < params.amount) throw new BadRequestException('insufficient fund');

    const bankProviderService = Container.get<IBankAccountProvider>(IBankAccountProviderToken);
    const referenceNo = uuidv4();
    const payoutResult = await bankProviderService.payout({
      amount: params.amount,
      currencyCode: params.currencyCode,
      destination: params.destination,
      narration: params.narration || referenceNo,
      payoutType: 'banktransfer',
      referenceNo: referenceNo,
      userid: params.userId,
    });
    if (payoutResult.isSuccess) {
      const transactionService = Container.get<ITransactionService>(transactionServiceToken);
      const debit = await transactionService.debit({
        userId: params.userId,
        amount: params.amount,
        currencyCode: params.currencyCode,
        referenceNo: referenceNo,
        category: TransactionCategoryEnum.Withdrawal,
        narration: params.narration,
        providerResponse: payoutResult.providerRespoonse,
      });
      logger.info('transfer successful');
      return;
    }

    throw new BadRequestException('unable to make transfer request');
  }
}
