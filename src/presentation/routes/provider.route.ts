import { Router } from 'express';

import { Routes } from '@/domain/interfaces/routes.interface';

import { ProviderController } from '../controllers/providers.controller';

export class ProviderRoute implements Routes {
  public path = '/api/v1/providers';
  public router = Router();
  public provider = new ProviderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/ravenbank/collection`, this.provider.ravenBankWebHook);
  }
}
