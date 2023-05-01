import { BaseResponse } from '../../application/common/model/base.response';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RavenBankWebHookService } from '@/application/providers/ravenbank/RevenBankWebhookService';

export class ProviderController {
  public ravenBankWebHook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const revenWebHookService = Container.get(RavenBankWebHookService);
      await revenWebHookService.handle(req.body);
      res.status(201).json(BaseResponse.Success(null, 'webhook event  processed successfully'));
    } catch (error) {
      next(error);
    }
  };
}
