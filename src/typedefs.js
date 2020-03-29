import userTypeDefs from './components/users/typedefs';

const typeDefs = `
"""
Query root type
"""
type Query {
  """
  Hello message
  """
  hello: String

  """
  Username message
  """
  username: String
}
`;

export default [typeDefs, userTypeDefs];
