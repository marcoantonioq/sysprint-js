export const state = () => ({
  printers: [],
});

export const getters = {
  printers(state) {
    return state.printers;
  },
};

export const mutations = {
  update(state, payload) {
    state = { ...state, ...payload };
  },
  updatePrinters(state, payload) {
    state.printers = payload;
  },
  remove(state, payload) {},
  togglePrinters(state, payload) {
    state.printers
      .filter((print) => print.name !== payload.name)
      .map((print) => {
        print.selected = false;
        return print;
      });
    payload.selected = !payload.selected;
  },
};

export const actions = {
  findPrint({ commit }, payload) {
    this.$axios.$get('/api/printers').then(({ data: printers }) => {
      commit('updatePrinters', printers);
    });
    commit('update', payload);
  },
  print({ commit, dispatch }, form) {
    return this.$axios.$post('/api/print', form);
  },
};
