import { BankTransferModel } from './../../application/bankaccount/model/bankTransferModel';
import { GenerateBankAccountDto } from '../../application/bankaccount/model/generateBankAccount.dto';
import { BankAccountController } from './../controllers/bankaccount.controller';
import { Router } from 'express';

import { Routes } from '@/domain/interfaces/routes.interface';
import { ValidationMiddleware } from '@/presentation/middlewares/validation.middleware';

export class BankAccountRoute implements Routes {
  public path = '/api/v1/bankaccounts';
  public router = Router();
  public auth = new BankAccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/generate`, ValidationMiddleware(GenerateBankAccountDto), this.auth.generateBankAccount);
    this.router.post(`${this.path}/bank-transfer`, ValidationMiddleware(BankTransferModel), this.auth.bankTransfer);
  }
}
