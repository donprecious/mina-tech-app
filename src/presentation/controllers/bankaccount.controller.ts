import { BankTransferModel } from './../../application/bankaccount/model/bankTransferModel';
import { GenerateBankAccountDto } from '../../application/bankaccount/model/generateBankAccount.dto';
import { IBankAccountService, IBankAccountServiceToken } from '../../application/bankaccount/IBankaccountService';
import { BaseResponse } from '../../application/common/model/base.response';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class BankAccountController {
  public generateBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bankaccountSercice = Container.get<IBankAccountService>(IBankAccountServiceToken);
      const request: GenerateBankAccountDto = req.body;
      const result = await bankaccountSercice.generateBankAccount(request);
      res.status(201).json(BaseResponse.Success(result));
    } catch (error) {
      next(error);
    }
  };

  public bankTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bankaccountSercice = Container.get<IBankAccountService>(IBankAccountServiceToken);
      const request: BankTransferModel = req.body;
      const result = await bankaccountSercice.bankTransferPayout(request);
      res.status(201).json(BaseResponse.Success(result));
    } catch (error) {
      next(error);
    }
  };
}
