import http from 'http';
import App from './app';
import Logger from './common/Logger';
import config from './config/config';
import PgDataSource from './data-source';

const logger = Logger(__filename);

const startUp = async () => {
  const connection = await PgDataSource.initialize();
  logger.info(`Database connected: ${connection.isInitialized}`);

  const server = http.createServer(App);

  server.listen(config.listenPort, config.listenHost, () => {
    logger.info(`Running at ${config.protocol}://${config.listenHost}:${config.listenPort}`);
    logger.info('Press CTRL-C to stop\n');
  });
};

startUp();