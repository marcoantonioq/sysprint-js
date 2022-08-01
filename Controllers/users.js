/* eslint-disable require-await */
import Spool from '../Models/Spool';
import * as auth from './Components/auth';

export async function prints(req, res) {
  const spool = await Spool.find(
    { copies: { $gte: 1 } },
    {
      file: 0,
      params: 0,
      updatedAt: 0,
      __v: 0,
    }
  ).sort({ job: -1 });
  try {
    const result = await Spool.aggregate([
      {
        $project: {
          _id: 0,
          job: 1,
          username: 1,
          printer: 1,
          copies: 1,
          status: 1,
        },
      },
      {
        $match: {
          copies: {
            $gte: 1,
          },
          status: 'completed',
          //   username: 'user',
          createdAt: {
            $gte: new Date('2021-07-19'),
            $lte: new Date('2023-05-01'),
          },
        },
      },
      {
        $group: {
          _id: {
            username: '$username',
            printer: '$printer',
          },
          impressions: {
            $sum: '$copies',
          },
          jobs: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          impressions: -1,
        },
      },
    ]);
    console.log(result);
    return res.json(result);
  } catch (e) {
    console.log(e);
  }
  return res.json(spool);
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
