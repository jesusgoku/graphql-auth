function extractTokenFromRequest(req) {
  const { authorization } = req.headers;

  if (!authorization || typeof authorization !== 'string' || !authorization.startsWith('JWT')) {
    return undefined;
  }

  const [, token] = authorization.split(' ');

  return token;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  extractTokenFromRequest,
};
