import * as dotenv from 'dotenv';
import { TypeormStore } from 'connect-typeorm/out';
import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import 'reflect-metadata';
import Session from './common/models/Session';
import config from './config/config';
import routes from './config/routes';
import PgDataSource from './data-source';
import ErrorHandler from './middlewares/ErrorHandling';

// Load environment variables from .env file
dotenv.config();

class App {
  public express: Application;

  constructor() {
    this.express = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandler();
  }

  private initRoutes() {
    Object.entries(routes).forEach(([route, controller]) => {
      this.express.use(`/api/${config.version}${route}`, controller);
    });
  }

  private initMiddlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(morgan('tiny'));
    this.express.use(
      cors({
        origin: config.enabledOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: StatusCodes.OK,
        exposedHeaders: ['X-Total-Count', 'Set-Cookie'],
        credentials: true,
      })
    );
    this.setupSession();
  }

  private initErrorHandler() {
    this.express.use(ErrorHandler);
  }

  private setupSession() {
    this.express.use(
      session({
        secret: config.sessionSecret,
        proxy: config.hasProxy,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: config.isCookieSecure,
          httpOnly: false,
        },
        store: new TypeormStore({
          cleanupLimit: 2,
          ttl: 604800000,
        }).connect(PgDataSource.getRepository(Session)),
      })
    );
  }
}

export default new App().express;
