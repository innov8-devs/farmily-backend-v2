export class validateCustomerInput {
  customerCode: string;
  country: string;
  type: string;
  account_number: string;
  bvn: string;
  bank_code: string;
  first_name: string;
  last_name: string;
};

export class baseTransactionInput {
  email: string;
  amount: string;
}

export class InitializeTransactionInput extends baseTransactionInput {
  currency?: string;
  split_code?: string;
  callback_url?: string;
  channel?: string[];
  metadata?: object;
}

export class chargeAuthorizationInput {
  authorization_code: string;
}