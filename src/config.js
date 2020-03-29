const {
  PORT = 4000,
  NODE_ENV = 'production',
  SECRET,
  GRAPHQL_SERVER = 'apollo',
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
} = process.env;

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

export { PORT, NODE_ENV, SECRET, GRAPHQL_SERVER, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME };
