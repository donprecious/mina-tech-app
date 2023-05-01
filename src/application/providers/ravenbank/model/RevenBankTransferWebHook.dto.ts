import { RavenBankWebHookBaseDto } from './RevenBankWebHookDto.dto';

export interface RavenTransferWebhookPayload extends RavenBankWebHookBaseDto {
  merchant_ref: string;
  meta: RavenSuccessTransferWebhookMeta;
  trx_ref: string;
  status: string;
  session_id: string;
  response: string;
}

export interface RavenSuccessTransferWebhookMeta {
  account_name: string;
  account_bank: string;
  account_number: string;
  narration: string;
  currency: string;
  amount: number;
}
