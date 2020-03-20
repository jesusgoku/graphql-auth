import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
    username: String
  }
`);

export default schema;
