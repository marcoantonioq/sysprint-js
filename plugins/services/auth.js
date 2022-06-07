/**
 * Usuários
 */
export const users = {};
const secrete = process.env.API_SECRETE || 'secretkeyappearshere';

const jwt = require('jsonwebtoken');

// eslint-disable-next-line require-await
export async function verifyJWT(req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  jwt.verify(token, secrete, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

export function createToke(data, secrete, config) {
  return jwt.sign(data, secrete, config);
}

export function createUser(data, config = { expiresIn: '2h' }) {
  const { username, email } = data;
  const nick = username || email;
  const token = createToke({ userId: 1, username: nick }, secrete, config);
  const user = {
    data: {
      token,
      user: {
        username: nick,
        email: '',
        description: '',
        rules: ['user'],
      },
    },
  };
  users[nick] = user;
  return users[nick];
}

export function getUser(token) {
  const nick = Object.keys(users).find((key) => {
    return users[key].data.token === token;
  });
  return users[nick];
}
