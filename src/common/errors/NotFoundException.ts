import { BaseException } from './BaseException';

export class NotFoundException extends BaseException {
  constructor(message?: string, stack?: string) {
    super(404, message ?? 'Resource not found', stack);
  }
}
