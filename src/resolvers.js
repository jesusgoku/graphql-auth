const resolvers = {
  Query: {
    hello: () => 'Hello World',

    username: (_parent, _args, { user }) => {
      if (!user) {
        throw new Error('Invalid user');
      }

      return user.username;
    },
  },
};

export default resolvers;
