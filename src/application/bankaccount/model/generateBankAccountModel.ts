export class GenerateBankAccountModel {
  firstname: string;
  lastname: string;
  email?: string;
  phoneNumber?: string;
  userId?: string;
  requestedAmount?: number;
  currencyCode?: string;
  constructor(firstname?: string, lastname?: string, email?, phoneNumber?: string, userId?: string, requestedAmount?: number) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phoneNumber = phoneNumber;
    this.userId = userId;
    this.requestedAmount = requestedAmount;
  }
}

export class GenerateBankAccountResponse {
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  requestedAmount?: number;
  isVirtual: boolean;
  isTemporary: boolean;
  providerResponse: string;
  constructor(
    accountNumber: string,
    accountName: string,
    bankName: string,
    requestedAmount: number,
    bankCode?: string,
    isVirtual?: boolean,
    isTemporary?: boolean,
    providerResponse?: string,
  ) {
    this.accountNumber = accountNumber;
    this.bankName = bankName;
    this.accountName = accountName;
    this.requestedAmount = requestedAmount ?? 0.0;
    this.bankCode = bankCode ?? '';
    this.isVirtual = isVirtual ?? false;
    this.isVirtual = isTemporary ?? false;
    this.providerResponse = providerResponse ?? '';
  }
}
