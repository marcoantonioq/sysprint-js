import { sleep } from './utils';
import lp from './lp';
import users from './users';

// eslint-disable-next-line require-await
export default async function init() {
  await sleep(5000);
  await lp();
  await users();
}
