import { v4 as uuidv4 } from 'uuid';

import client from '../../../pool';

async function list({ limit, offset }) {
  const result = await client.query(
    'SELECT id, username, password, roles::text[] FROM users LIMIT $1 OFFSET $2',
    [limit, offset],
  );

  return result.rows;
}

async function get(id) {
  const result = await client.query(
    'SELECT id, username, password, roles::text[] FROM users WHERE id = $1',
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error('Not found');
  }

  return result.rows[0];
}

async function create(user) {
  const id = uuidv4();
  const result = await client.query(
    'INSERT INTO users (id, username, password, roles) VALUES ($1, $2, $3, $4) RETURNING id, username, password, roles::text[]',
    [id, user.username, user.password, user.roles],
  );

  return result.rows[0];
}

async function update(user) {
  const result = await client.query(
    'UPDATE users SET username = $1, password = $2, roles = $3 WHERE id = $4 RETURNING id, username, password, roles::text[]',
    [user.username, user.password, user.roles, user.id],
  );

  return result.rows[0];
}

async function remove(id) {
  await client.query('DELETE FROM users WHERE id = $1', [id]);

  return true;
}

export { list, get, create, update, remove };
