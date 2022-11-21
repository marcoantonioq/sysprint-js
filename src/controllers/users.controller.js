/* eslint-disable require-await */
import * as auth from '../lib/auth';
// eslint-disable-next-line no-unused-vars
import db from '../../prisma/db';

export class CreateUserController {
  async handle(request, response) {
    try {
      const user = await db.users.create(request.body);
      return response.json(user);
    } catch (e) {
      console.log('Erro:', e);
      return response.json({ status: 'error' + e });
    }
  }
}

export async function prints(req, res) {
  const result = {};
  return res.json(result);
}

export async function login(req, res) {
  return auth.authentication(req, res);
}
export async function logout(req, res) {
  return auth.deleteToke(req, res);
}

export async function logged(req, res) {
  return auth.getUser(req, res);
}

export async function verify(req, res, next) {
  return auth.verifyJWT(req, res, next);
}

export async function users(req, res) {
  return res.json(auth.users);
}
