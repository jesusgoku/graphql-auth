import { ApolloServer } from 'apollo-server-express';
import { verify as verifyCallback } from 'jsonwebtoken';
import { promisify } from 'util';

import { SECRET, NODE_ENV } from './config';
import { typeDefs, resolvers } from './schema';

const verify = promisify(verifyCallback);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: NODE_ENV !== 'production',
  context: async ({ req }) => {
    const { authorization } = req.headers;

    if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('JWT')) {
      return undefined;
    }

    const [, token] = authorization.split(' ');

    const { user } = await verify(token, SECRET);

    return { user };
  },
});

export default server;
