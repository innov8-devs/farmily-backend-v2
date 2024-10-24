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
  callback_url?: string;
}

export class InitializeTransactionInput extends baseTransactionInput {
  currency?: string;
  split_code?: string;
  channel?: string[];
  metadata?: object;
}

export class chargeAuthorizationInput extends baseTransactionInput {
  metadata?: object;
  authorization_code: string;
}

export class payWithSavedCard extends baseTransactionInput{
  cardId: string;
  userId: string;
  orderId: string;
  callback_url: string;
}