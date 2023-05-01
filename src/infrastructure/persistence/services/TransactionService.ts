import { IWithdraw } from '@/domain/interfaces/withdraws.interface';
import { WithdrawCreatedEvent } from '@/domain/events/withdrawCreatedEvent';
import { WithdrawModel } from './../models/withdraws.model';
import { logger } from '@utils/logger';
import { BadRequestException } from '@/application/exceptions/badRequestException';
import { UserModel } from '@/infrastructure/persistence/models/users.model';
import { DepositCreatedEvent } from './../../../domain/events/depositCreatedEvent';
import { eventBusToken, IEventbus } from './../../../application/eventHandler/ieventbus';
import { WalletModel } from './../models/wallets.model';
import { TransactionModel } from './../models/transactions.model';
import { DepositModelDto } from '@/application/transaction/model/depositModel';
import { ITransaction } from '@/domain/interfaces/transaction.interface';
import { DepositModel } from '../models/deposits.model';
import { ITransactionService } from '../../../application/transaction/ItransactionService.interface';
import { TransactionCategoryEnum, TransactionTypeEnum } from '@/domain/enums/transactionEnums';
import { Service, Container } from 'typedi';
import { IWalletService, walletServiceInjectionToken } from '@/application/wallet/IwalletService';

import { IWallet } from '@/domain/interfaces/wallets.interface';
import { v4 as uuidv4 } from 'uuid';
import { TransactionQueryParam, TransactionsPagingatedResult } from '@/application/transaction/model/transactionQueryParam';

@Service()
export class TransactionService implements ITransactionService {
  async deposit(model: DepositModelDto): Promise<ITransaction> {
    try {
      const user = await UserModel.query().findOne({ id: model.userId });
      if (!user) throw new BadRequestException('user not found with id:' + model.userId);
      let wallet: IWallet;
      const findWallet = await WalletModel.query().findOne({ userId: model.userId, currencyCode: model.currencyCode });
      if (!findWallet) {
        const walletService = Container.get<IWalletService>(walletServiceInjectionToken);
        if (!walletService) throw new Error('unable to get wallet service from dependencies');
        const result = await walletService.createWallet({ currencyCode: model.currencyCode, userid: model.userId });
        wallet = result;
      } else {
        wallet = findWallet;
      }

      const findExistingTransacation = await TransactionModel.query().where('referenceNo', model.referenceId).first();
      if (findExistingTransacation) throw new Error('duplicate transaction');

      let transaction = new TransactionModel();

      transaction.setTransaction(
        model.userId,
        model.referenceId,
        model.amount,
        model.currencyCode,
        TransactionTypeEnum.Credit,
        TransactionCategoryEnum.Deposit,
        model.narration,
      );
      let deposit = new DepositModel();

      deposit.setDeposit(model.userId, model.amount, model.currencyCode, transaction.id, model.referenceId, model.narration, model.providerResponse);

      const result = await TransactionModel.transaction(async trx => {
        try {
          transaction = await TransactionModel.query(trx).insert(transaction);
          deposit.transactionId = transaction.id;

          deposit = await DepositModel.query(trx).insert(deposit);

          await WalletModel.query(trx)
            .where('id', wallet.id)
            .patch({
              amount: wallet.amount + model.amount,
            });
          return { transaction, deposit };
        } catch (ex) {
          logger.error(ex.message);
          logger.error(JSON.stringify(ex));
          throw ex;
        }
      });
      const eventBus = Container.get<IEventbus>(eventBusToken);
      if (eventBus) {
        await eventBus.publish(DepositCreatedEvent.eventName, new DepositCreatedEvent(result.transaction));
      }
      return result.transaction;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  async debit(model: {
    userId: string;
    amount: number;
    currencyCode: string;
    referenceNo?: string;
    narration?: string;
    providerResponse?: string;
    category?: TransactionCategoryEnum;
  }): Promise<ITransaction> {
    const user = await UserModel.query().findOne({ id: model.userId });
    if (!user) throw new BadRequestException('user not found with id:' + model.userId);

    let wallet: IWallet;
    const findWallet = await WalletModel.query().findOne({ userId: model.userId, currencyCode: model.currencyCode });
    if (!findWallet) {
      const walletService = Container.get<IWalletService>(walletServiceInjectionToken);
      if (!walletService) throw new Error('unable to get wallet service from dependencies');
      const result = await walletService.createWallet({ currencyCode: model.currencyCode, userid: model.userId });
      wallet = result;
    } else {
      wallet = findWallet;
    }
    let referenceNo = model.referenceNo;
    if (referenceNo) {
      const findExistingTransacation = await TransactionModel.query().where('referenceNo', model.referenceNo).first();
      if (findExistingTransacation) throw new Error('duplicate transaction');
    } else {
      referenceNo = uuidv4();
    }

    let transaction = new TransactionModel();
    model.narration = model.narration || `payout of ${model.currencyCode} ${model.amount}`;
    model.category = model.category || TransactionCategoryEnum.Withdrawal;
    transaction.setTransaction(
      model.userId,
      referenceNo,
      model.amount,
      model.currencyCode,
      TransactionTypeEnum.Debit,
      model.category,
      model.narration,
    );

    let withdraw = new WithdrawModel();

    withdraw.setWithdraw(model.userId, model.amount, model.currencyCode, transaction.id, referenceNo, model.narration, model.providerResponse);

    const result = await TransactionModel.transaction(async trx => {
      try {
        transaction = await TransactionModel.query(trx).insert(transaction);
        withdraw.transactionId = transaction.id;

        withdraw = await WithdrawModel.query(trx).insert(withdraw);

        await WalletModel.query(trx)
          .where('id', wallet.id)
          .patch({
            amount: wallet.amount - model.amount,
          });
        return { transaction, withdraw };
      } catch (ex) {
        logger.error(ex.message);
        logger.error(JSON.stringify(ex));
        throw ex;
      }
    });
    const eventBus = Container.get<IEventbus>(eventBusToken);
    if (eventBus) {
      await eventBus.publish(WithdrawCreatedEvent.eventName, new WithdrawCreatedEvent(result.transaction));
    }
    return result.transaction;
  }

  async handleTransferNotification(param: { referenceNo: string; isSuccess: boolean; payload?: string }): Promise<ITransaction> {
    if (param.isSuccess) {
      const withdraw = await WithdrawModel.query().where('referenceNo', param.referenceNo).first();
      if (!withdraw) throw Error('withdraw transaction with referenceNo ' + param.referenceNo + ' not found');

      if (param.payload) {
        let providerResponse = '--- Payload Start --- \n' + withdraw.providerResponse + ' \n ---  Payload End --- \n';
        providerResponse += '--- Payload Start --- \n' + param.payload + ' \n ---  Payload End --- \n';
        await WithdrawModel.query().where('referenceNo', param.referenceNo).patch({ providerResponse: providerResponse });
        return;
      }
    } else {
      const transaction = await TransactionModel.query().where('referenceNo', param.referenceNo).first();
      if (!transaction) throw Error(' transaction with referenceNo ' + param.referenceNo + ' not found');

      // check for dublicate reverasal transaction
      const existingReversed = await TransactionModel.query()
        .where('referenceNo', 'reversal:' + param.referenceNo)
        .first();
      if (existingReversed) throw Error('duplicate transaction');

      const reversal = await this.deposit({
        amount: transaction.amount,
        referenceId: 'reversal:' + transaction.referenceNo,
        currencyCode: transaction.currencyCode,
        userId: transaction.userId,
        narration: 'Reversal of ' + transaction.narration,
        providerResponse: param.payload || '',
      });
      logger.info('reverse transaction completed for ' + transaction.referenceNo);
      return;
    }
  }

  async getTransactions(param: TransactionQueryParam): Promise<TransactionsPagingatedResult> {
    if (param.limit > 50) param.limit = 50;
    let query = TransactionModel.query();
    if (param.search) {
      query = query.where('narration', 'like', `%${param.search}%`);
    }
    if (param.transactionType) {
      query = query.where('transactionType', param.transactionType);
    }
    if (param.category) {
      query = query.where('transactionCategory', param.category);
    }
    if (param.userId) {
      query = query.where('userId', param.category);
    }
    const result = await query.page(param.page, param.limit);
    const resp = {
      items: result.results as ITransaction[],
      page: param.page,
      total: result.total,
      pageSize: result.results.length,
    } as TransactionsPagingatedResult;
    return resp;
  }

  async getTransaction(id: string): Promise<ITransaction> {
    const record = await TransactionModel.query().where('id', id).withGraphFetched('[deposit, withdraw]').first();
    const result = record as ITransaction;
    return result;
  }
}
