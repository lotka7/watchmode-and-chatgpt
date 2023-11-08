import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(message: string, stack?: string) {
    super(400, message, stack);
  }
}
