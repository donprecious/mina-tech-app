import { transactionServiceToken, ITransactionService } from './../../application/transaction/ItransactionService.interface';
import { TransactionQueryParam } from '@/application/transaction/model/transactionQueryParam';
import { BaseResponse } from '../../application/common/model/base.response';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ITransaction } from '@/domain/interfaces/transaction.interface';

export class TransactionsController {
  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = new TransactionQueryParam(req.query as Partial<TransactionQueryParam>);
      const transactionService = Container.get<ITransactionService>(transactionServiceToken);
      const result = await transactionService.getTransactions(query);
      res.status(201).json(BaseResponse.Success(result));
    } catch (error) {
      next(error);
    }
  };

  public getTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionService = Container.get<ITransactionService>(transactionServiceToken);
      const id = req.params.id;
      const result = await transactionService.getTransaction(id);
      if (!result) {
        res.status(404).json(BaseResponse.Failue([], 'transaction not found'));
      }
      res.status(200).json(BaseResponse.Success(result));
    } catch (error) {
      next(error);
    }
  };
}
