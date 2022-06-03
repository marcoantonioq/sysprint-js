export const state = () => ({
  printers: [],
  FILES_FORMATS: ['application/pdf'],
});

export const getters = {
  printers(state) {
    return state.printers;
  },
};

export const mutations = {
  update(state, payload) {
    console.log('Update::: ', payload);
    state = { ...state, ...payload };
  },
  updatePrinters(state, payload) {
    state['printers'] = payload;
  },
  remove(state, payload) {},
  toggle(state, payload) {
    payload.selected = !payload.selected;
  },
};

export const actions = {
  print({ commit, dispatch }, message) {
    this.$hello(message);
  },
  update({ commit }, payload) {
    commit('update', payload);
  },
  remove({ commit }, payload) {
    commit('remove', payload);
  },
  toggle({ commit }, payload) {
    commit('toggle', payload);
  },
};
