import { BaseException } from './BaseException';

export class NetworkException extends BaseException {
  constructor(message: string, stack?: string) {
    super(500, message ?? 'Unknown Network Error', stack);
  }
}
