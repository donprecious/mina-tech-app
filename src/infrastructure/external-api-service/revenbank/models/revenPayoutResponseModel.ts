export interface RavenPayoutResponsePayload {
  status: string;
  message: string;
  data: RavenPayoutResponsePayloadData;
}

export interface RavenPayoutResponsePayloadData {
  email: string;
  trx_ref: string;
  merchant_ref: string;
  amount: number;
  bank: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration: string;
  fee: number;
  status: string;
  created_at: Date;
  id: number;
}
