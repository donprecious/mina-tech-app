import { ITransactionService, transactionServiceToken } from './../../transaction/ItransactionService.interface';
import { IBankAccountService, IBankAccountServiceToken } from './../../bankaccount/IBankaccountService';
import { logger } from '@/utils/logger';
import { Service, Container } from 'typedi';
import { RavenBankCollectionWebhookDto, RavenBankWebHookBaseDto } from './model/RevenBankWebHookDto.dto';
import { RavenTransferWebhookPayload } from './model/RevenBankTransferWebHook.dto';

@Service()
export class RavenBankWebHookService {
  /**
   *
   */
  async handle(data: unknown) {
    const dataDto = data as RavenBankWebHookBaseDto;
    if (dataDto.type === 'collection') {
      return await this.handleCollectionRecieved(data as RavenBankCollectionWebhookDto);
    } else if (dataDto.type == 'transfer') {
      return await this.HandleTranferNotification(data as RavenTransferWebhookPayload);
    }
    throw Error('unhandled  webhook type received: ' + JSON.stringify(data));
  }

  private async handleCollectionRecieved(data: RavenBankCollectionWebhookDto) {
    const bankAccountService = Container.get<IBankAccountService>(IBankAccountServiceToken);
    const bankAccount = await bankAccountService.getBankAccount({ accountNo: data.account_number });
    if (!bankAccount) throw Error('Bank account not found with account number: ' + data.account_number);
    const tranactionService = Container.get<ITransactionService>(transactionServiceToken);
    await tranactionService.deposit({
      amount: data.amount,
      currencyCode: bankAccount.currencyCode,
      referenceId: data.session_id,
      userId: bankAccount.userId,
      narration: `deposit of ${bankAccount.currencyCode} ${data.amount} recieved from ${data.source.first_name} | ${data.source.last_name}`,
      providerResponse: JSON.stringify(data),
    });
    logger.info('fund collection completed successfully');
  }

  private async HandleTranferNotification(data: RavenTransferWebhookPayload) {
    const tranactionService = Container.get<ITransactionService>(transactionServiceToken);

    await tranactionService.handleTransferNotification({
      referenceNo: data.merchant_ref,
      payload: JSON.stringify(data),
      isSuccess: data.status == 'successful',
    });
  }
}
