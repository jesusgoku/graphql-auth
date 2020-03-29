import * as services from './services';
import { createUserInputSchema, updateUserInputSchema } from './schemas';
import validateSchemaResolver from '../../shared/resolvers/validateSchema';

async function list(_parent, { limit, offset }) {
  return services.list({ limit, offset });
}

async function get(_parent, { id }) {
  return services.get(id);
}

async function create(_parent, { user }) {
  return services.create(user);
}

async function update(_parent, { user }) {
  return services.update(user);
}

async function remove(_parent, { id }) {
  return services.remove(id);
}

const resolvers = {
  Query: {
    listUsers: list,
    getUser: get,
  },

  Mutation: {
    createUser: validateSchemaResolver(createUserInputSchema)(create),
    updateUser: validateSchemaResolver(updateUserInputSchema)(update),
    deleteUser: remove,
  },
};

export default resolvers;
