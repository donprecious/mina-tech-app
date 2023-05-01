export interface RavenBankWebHookBaseDto {
  type: 'collection' | 'transfer' | 'electricity';
  secret: string;
}

export interface RavenBankCollectionWebhookDto extends RavenBankWebHookBaseDto {
  amount: number;
  session_id: string;
  account_number: string;
  source: RavenBankCollectionSource;
}

export interface RavenBankCollectionSource {
  account_number: string;
  first_name: string;
  last_name: string;
  narration: string;
  bank: string;
  bank_code: string;
  createdAt: string;
}
