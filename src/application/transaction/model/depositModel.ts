export class DepositModelDto {
  amount: number;
  currencyCode: string;
  userId: string;
  referenceId: string;
  narration?: string;
  providerResponse?: string;
}
