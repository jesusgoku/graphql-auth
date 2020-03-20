import { sign } from 'jsonwebtoken';

import { SECRET } from './config';

function login(req, res) {
  const { username } = req.body;

  // TODO: check credentials
  if (!username) {
    res.status(400).json({ errors: [{ message: 'username not found' }] });
  }

  const user = {
    id: '1234567890',
    username,
    roles: ['anonymous'],
  };

  sign({ user }, SECRET, (err, token) => {
    if (err) {
      res.status(500).json({ errors: [{ message: 'no token generation' }] });
    }

    res.json({ token });
  });
}

export {
  // eslint-disable-next-line import/prefer-default-export
  login,
};
