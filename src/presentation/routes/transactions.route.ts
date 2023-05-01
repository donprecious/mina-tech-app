import { TransactionsController } from './../controllers/transaction.controller';

import { Router } from 'express';

import { Routes } from '@/domain/interfaces/routes.interface';

export class TransactionRoutes implements Routes {
  public path = '/api/v1/transactions';
  public router = Router();
  public trans = new TransactionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.trans.getTransactions);
    this.router.get(`${this.path}/:id`, this.trans.getTransaction);
  }
}
