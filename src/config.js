const { PORT = 4000, NODE_ENV = 'production', SECRET, GRAPHQL_SERVER = 'apollo' } = process.env;

if (!SECRET) {
  throw new Error('Environment var "SECRET" not defined');
}

const availableGraphQLServers = ['apollo', 'graphql'];
if (!availableGraphQLServers.includes(GRAPHQL_SERVER)) {
  throw new Error(
    `Environment var "GRAPHQL_SERVER" invalid. Available values: ${availableGraphQLServers.join(
      ', ',
    )}`,
  );
}

export { PORT, NODE_ENV, SECRET, GRAPHQL_SERVER };
