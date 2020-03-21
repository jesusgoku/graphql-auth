import { ApolloServer } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';

import { SECRET, NODE_ENV } from './config';
import { typeDefs, resolvers } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: NODE_ENV !== 'production',
  context: ({ req }) =>
    new Promise((resolve, reject) => {
      const { authorization } = req.headers;

      if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('JWT')) {
        resolve(undefined);
      }

      const [, token] = authorization.split(' ');

      verify(token, SECRET, (err, { user }) => {
        if (err) {
          reject(err);

          return;
        }

        resolve({ user });
      });
    }),
});

export default server;
