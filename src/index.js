import { createServer } from 'http';

import { PORT } from './config';
import app from './app';
import logger from './logger';

const server = createServer(app);

server.listen(PORT, () => {
  logger.debug(`Listen on: http://0.0.0.0:${PORT}`);
});
