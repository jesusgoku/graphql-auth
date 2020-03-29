import * as services from './services';

async function list(req, res) {
  const { limit, offset } = req.query;

  res.json(await services.list({ limit, offset }));
}

async function get(req, res) {
  const { id } = req.params;

  res.json(await services.get(id));
}

async function create(req, res) {
  const { user } = req.body;

  res.json(await services.create(user));
}

async function update(req, res) {
  const { id } = req.params;
  const { user } = req.body;

  res.json(await services.update({ ...user, id }));
}

async function remove(req, res) {
  const { id } = req.query;

  await services.remove(id);

  res.sendStatus(204);
}

export { list, get, create, update, remove };
