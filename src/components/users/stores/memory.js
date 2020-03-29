import { v4 as uuidv4 } from 'uuid';

let users = {};

async function create(user) {
  const value = {
    ...user,
    id: uuidv4(),
  };

  users[value.id] = value;

  return value;
}

async function get(id) {
  const user = users[id];

  if (!user) {
    throw new Error('Not found');
  }

  return user;
}

async function list({ limit = 10, offset = 0 } = {}) {
  return Object.values(users).slice(offset, limit);
}

async function update(user) {
  if (!users[user.id]) {
    throw new Error('Not found');
  }

  users[user.id] = user;

  return user;
}

async function remove(id) {
  if (!users[id]) {
    throw new Error('Not found');
  }

  const { [id]: _, ...rest } = users;
  users = rest;

  return true;
}

export { list, get, create, update, remove };
