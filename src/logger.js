import { createLogger, transports, format } from 'winston';

import { NODE_ENV } from './config';

const logger = createLogger({
  level: NODE_ENV === 'production' ? 'warn' : 'debug',
  format: format.json(),
  transports: [new transports.Console()],
});

export default logger;
