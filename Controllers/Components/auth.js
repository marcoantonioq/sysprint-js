const jwt = require('jsonwebtoken');
/**
 * Usuários
 */
export const users = {};
const secrete = process.env.API_SECRETE || 'secretkeyappearshere';

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

export function deleteToke(req, res) {
  const token = req.headers.authorization;
  return res.json({ status: 'OK', token });
}

export function createToke(data, secrete, config) {
  return jwt.sign(data, secrete, config);
}

export function authentication({ body }, res) {
  const config = { expiresIn: '2h' };
  const { username, email } = body;
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
  return res.status(200).json(users[nick]);
}

export function getUser(req, res) {
  const token = req.headers.authorization;
  const nick = Object.keys(users).find((key) => {
    return users[key].data.token === token;
  });
  res.json(users[nick]);
}
