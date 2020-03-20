const rootValue = {
  hello: () => 'Hello World',

  username: (_parent, { user }) => {
    if (!user) {
      throw new Error('Invalid user');
    }

    return user.username;
  },
};

export default rootValue;
