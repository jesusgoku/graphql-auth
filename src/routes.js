import { Router } from 'express';

import { login, refresh } from './handlers';

const routes = Router();

routes.post('/login', login);
routes.post('/refresh', refresh);

export default routes;
