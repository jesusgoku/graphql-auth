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

export default typeDefs;
