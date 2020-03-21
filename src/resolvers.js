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

export default resolvers;
