import { Pool } from 'pg';

import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from './config';
import logger from './logger';

const client = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

client.on('connect', () => {
  logger.info('pool connect');
});

client.on('remove', () => {
  logger.info('pool remove');
});

export default client;
