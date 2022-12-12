import MicroEmitter from 'micro-emitter';

const state = {
  services: [],
  emitter: new MicroEmitter(),
};

export const emitter = state.emitter;

export default state;
