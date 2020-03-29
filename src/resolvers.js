import { mergeDeepRight } from 'ramda';
import userResolvers from './components/users/resolvers';

const resolvers = {
  Query: {
    hello: () => 'Hello World',

    username: (_parent, _args, { user }) => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      return user.username;
    },
  },
};

export default mergeDeepRight(resolvers, userResolvers);
