const { PORT = 4000, NODE_ENV = 'production', SECRET } = process.env;

if (!SECRET) {
  throw new Error('Environment var SECRET not defined');
}

export { PORT, NODE_ENV, SECRET };
