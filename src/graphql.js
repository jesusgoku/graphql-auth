import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { NODE_ENV } from './config';
import { typeDefs, resolvers } from './schema';

const isProduction = NODE_ENV === 'production';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphQL = graphqlHTTP({
  schema,
  graphiql: !isProduction,
  pretty: !isProduction,
});

export default graphQL;
