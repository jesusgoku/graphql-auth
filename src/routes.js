import { Router } from 'express';

import { login } from './handlers';

const routes = Router();

routes.post('/login', login);

export default routes;
