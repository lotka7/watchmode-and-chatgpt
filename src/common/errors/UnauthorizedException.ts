import { BaseException } from './BaseException';

export class UnauthorizedException extends BaseException {
  constructor(message: string, stack?: string) {
    super(401, message, stack);
  }
}
