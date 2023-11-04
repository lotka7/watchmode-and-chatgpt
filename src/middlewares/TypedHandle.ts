import { NextFunction, RequestHandler } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

type TypedRequest<
  Params extends Record<string, string>,
  ReqBody,
  ResBody
> = Request<Params, ResBody, ReqBody, qs.ParsedQs, Record<string, unknown>>;

type TypedResponse<ResBody> = Response<
  ResBody,
  Record<string, unknown>,
  StatusCodes
>;

export type TypedHandler<
  ReqBody = void,
  ResBody = void,
  Params extends Record<string, string> = Record<string, string>
> = (
  req: TypedRequest<Params, ReqBody, ResBody>,
  res: TypedResponse<ResBody>,
  next: NextFunction
) => Promise<TypedResponse<ResBody> | void>;

/**
 * Allows strongly typed Express Request and Response bodies
 */
const TypedHandle = <ReqBody, ResBody, ParamKeys extends string = string>(
  handler: TypedHandler<ReqBody, ResBody, Record<ParamKeys, string>>
) => {
  const asyncUtilWrap: TypedHandler<
    ReqBody,
    ResBody,
    Record<ParamKeys, string>
  > = (req, res, next) => {
    const fnReturn = handler(req, res, next);
    return Promise.resolve(fnReturn).catch(next);
  };

  return asyncUtilWrap as unknown as RequestHandler;
};

export default TypedHandle;
