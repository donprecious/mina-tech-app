import { httpClientInstance } from './../../../utils/httpclient';
import { IBankAccountProviderToken } from '@/application/bankaccount/IBankAccountProvider';
import { BadRequestException } from './../../../application/exceptions/badRequestException';
import { GenerateBankAccountModel, GenerateBankAccountResponse } from '@/application/bankaccount/model/generateBankAccountModel';
import axios, { AxiosError, isAxiosError } from 'axios';
import { IBankAccountProvider } from '../../../application/bankaccount/IBankAccountProvider';

import { REVENBANK_BASEURL, REVENBANK_SECRET_KEY } from '@/config';
import { CreateCollectionAccountResponse } from './models/createCollectionAccount';
import { logger } from '@utils/logger';
import { Service } from 'typedi';
import { isInstance } from 'class-validator';
import { IPayoutRequestModel, PayoutResponseModel } from '@/application/bankaccount/model/payoutRequestModel';
import { RavenPayoutResponsePayload } from './models/revenPayoutResponseModel';

@Service(IBankAccountProviderToken)
export class RevenBankService implements IBankAccountProvider {
  /**
   *
   */
  baseUrl = REVENBANK_BASEURL;
  secretKey = REVENBANK_SECRET_KEY;

  httpClient = httpClientInstance({
    baseURL: this.baseUrl,
    headers: { Authorization: 'Bearer ' + this.secretKey },
  });

  async generateBankAccount(model: GenerateBankAccountModel): Promise<GenerateBankAccountResponse> {
    try {
      const result = await this.httpClient.post<CreateCollectionAccountResponse>('/v1/pwbt/generate_account', {
        first_name: model.firstname,
        last_name: model.lastname,
        email: model.email,
        phone: model.phoneNumber,
        amount: model.requestedAmount,
      });
      if (result.data.status === 'success' && result.data.data) {
        const generatedAccount = result.data.data;
        const response: GenerateBankAccountResponse = new GenerateBankAccountResponse(
          generatedAccount.account_number,
          generatedAccount.account_name,
          generatedAccount.bank,
          Number(generatedAccount.amount),
        );

        response.providerResponse = JSON.stringify(result.data);
        response.isVirtual = true;
        response.isTemporary = true;

        return response;
      } else {
        throw new BadRequestException(result?.data?.message ?? 'Something went wrong with the request to generate a new account');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<CreateCollectionAccountResponse>;
        const errorMessage = axiosError.response?.data?.message;
        throw new BadRequestException(errorMessage ?? error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    return null;
  }

  async payout(model: IPayoutRequestModel): Promise<PayoutResponseModel> {
    try {
      const result = await this.httpClient.post<RavenPayoutResponsePayload>('/v1/transfers/create', {
        amount: model.amount,
        bank_code: model.destination.bankCode,
        bank: model.destination.bankName,
        account_number: model.destination.bankAccountNumber,
        account_name: model.destination.accountName,
        narration: model.narration,
        reference: model.referenceNo,
        currency: model.currencyCode.toUpperCase(),
      });
      if (result.data.status === 'success' && result.data.data) {
        const data = result.data.data;

        const response = {
          isSuccess: data.status === 'success' || data.status == 'pending',
          providerRespoonse: JSON.stringify(data),
          referenceId: data.merchant_ref,
          providerReference: data.trx_ref,
          userId: model.userid,
        } as PayoutResponseModel;

        return response;
      } else {
        throw new BadRequestException(result?.data?.message ?? 'Something went wrong with the request to generate a new account');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<CreateCollectionAccountResponse>;
        const errorMessage = axiosError.response?.data?.message;
        logger.error(errorMessage);
        logger.error(error.message);
        throw new BadRequestException(errorMessage ?? error.message);
      } else {
        logger.error(error.message);
        throw new BadRequestException(error.message);
      }
    }
  }

  handleError(error: any) {
    logger.error(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error(error.response.data);
      logger.error(error.response.status);
      logger.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      logger.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('Error', error.message);
    }
    logger.error(error.config);
  }
}
