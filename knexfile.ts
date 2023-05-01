import { Knex } from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from './src/config';
require('ts-node/register');

const dbConfig = {
  client: 'mysql2',
  connection: {
    charset: 'utf8',
    timezone: 'Z', //'UTC',
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
  },
  migrations: {
    directory: 'src/infrastructure/database/migrations',
    tableName: 'migrations',
    // stub: 'src/database/stubs',
  },
  seeds: {
    directory: 'src/infrastructure/database/seeds',
    // stub: 'src/database/stubs',
  },
  debug: true,
} as Knex.Config;

module.exports = dbConfig;
