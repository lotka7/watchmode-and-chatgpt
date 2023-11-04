import { DataSource } from 'typeorm';
import Session from './common/models/Session';
import Description from './modules/SearchMovie/models/Description';

const entities = [Description, Session];

const PgDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'watchmode-gpt',
  username: 'watchmode-gpt',
  password: 'super-secret-password',
  synchronize: true,
  logging: ['error'],
  entities,
  subscribers: [],
  migrations: [],
});

export default PgDataSource;
