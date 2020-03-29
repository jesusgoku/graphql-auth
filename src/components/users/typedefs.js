const typeDefs = `
extend type Query {
  listUsers(limit: Int = 10, offset: Int = 0): [User]
  getUser(id: String!): User
}

type Mutation {
  createUser(user: CreateUserInput): User
  updateUser(user: UpdateUserInput): User
  deleteUser(id: String!): Boolean
}

input CreateUserInput {
  username: String!
  password: String!
  roles: [String!]
}

input UpdateUserInput {
  id: String!
  username: String!
  password: String
  passwordOld: String
  roles: [String!]
}

type User {
  id: String
  username: String
  roles: [String]
}
`;

export default typeDefs;
