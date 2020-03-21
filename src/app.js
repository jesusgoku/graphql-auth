import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import { GRAPHQL_SERVER } from './config';
import { authentication } from './middlewares';
import graphQL from './graphql';
import apolloServer from './apollo';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

if (GRAPHQL_SERVER === 'apollo') {
  app.use(apolloServer.getMiddleware({ path: '/graphql' }));
} else {
  app.use('/graphql', authentication, graphQL);
}

export default app;
