import { HttpException } from './httpException';

export class BadRequestException extends HttpException {
  constructor(message) {
    super(400, message);
    this.message = message;
  }
}
