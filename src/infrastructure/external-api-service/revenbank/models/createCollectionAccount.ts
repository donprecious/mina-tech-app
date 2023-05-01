export interface CreateCollectionAccountResponse {
  status: string;
  message: string;
  data: CreateCollectionAccountData;
}

export interface CreateCollectionAccountData {
  account_number: string;
  account_name: string;
  bank: string;
  customer: Customer;
  isPermanent: boolean;
  amount: string;
}

export interface Customer {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}
