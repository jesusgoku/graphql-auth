import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import { authentication } from './middlewares';
import graphQL from './graphql';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(authentication);
app.use(routes);
app.use('/graphql', graphQL);

export default app;
