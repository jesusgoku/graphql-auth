import { Pool } from 'pg';

import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from './config';

const client = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

export default client;
