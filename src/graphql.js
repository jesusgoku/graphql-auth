import graphqlHTTP from 'express-graphql';

import { NODE_ENV } from './config';
import schema from './schema';

const isProduction = NODE_ENV === 'production';

const graphQL = graphqlHTTP({
  schema,
  graphiql: !isProduction,
  pretty: !isProduction,
});

export default graphQL;
