import { BadRequestException } from './../../application/exceptions/badRequestException';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/application/exceptions/httpException';
import { logger } from '@utils/logger';
import { BaseResponse } from '@/application/common/model/base.response';

export const ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    if (error instanceof BadRequestException) {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(status).json(BaseResponse.Failue([message], message));
    } else if (error instanceof HttpException) {
      const status: number = error.status || 500;
      const message: string = error.message || 'Something went wrong';
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(status).json(BaseResponse.Failue([message], message));
    } else {
      res.status(500).json(BaseResponse.Failue(['An unexpected error occurred', error.message], 'An unexpected error occurred'));
    }
  } catch (error) {
    next(error);
  }
};
