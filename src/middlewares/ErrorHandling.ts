import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../common/errors/BaseException';
import Logger from '../common/Logger';
import config from '../config/config';

const logger = Logger(__filename);

export default function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void | Response {
  // If response is already streaming, have express close the connection
  if (res.headersSent) {
    return next(err);
  } else {
    logger.error(err.stack ?? err.message);

    let response: ErrorResponse;
    if (err instanceof BaseException) {
      response = {
        message: err.message,
        statusCode: err.statusCode,
      };
    } else {
      response = {
        message: 'Internal Server Error',
        statusCode: 500,
      };
    }

    if (config.sendErrorStack) {
      response.stack = err.stack?.split('\n').map((l) => l.trim());
    }

    return res.status(response.statusCode).send(response);
  }
}

type ErrorResponse = {
  message: string;
  statusCode: number;
  stack?: string[];
};
