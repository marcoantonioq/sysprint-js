// import MicroEmitter from 'micro-emitter';

export function response(response) {
  return {
    ...{
      msg: '',
      data: [],
      status: 1,
    },
    ...response,
  };
}
