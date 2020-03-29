import { Router } from 'express';

import { login, refresh } from './handlers';
import userRoutes from './components/users/routes';

const routes = Router();

routes.post('/login', login);
routes.post('/refresh', refresh);
routes.use('/users', userRoutes);

export default routes;
