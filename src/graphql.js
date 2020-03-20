import graphqlHTTP from 'express-graphql';

import { NODE_ENV } from './config';
import schema from './schema';
import rootValue from './resolvers';

const isProduction = NODE_ENV === 'production';

const graphQL = graphqlHTTP({
  schema,
  rootValue,
  graphiql: !isProduction,
  pretty: !isProduction,
});

export default graphQL;
