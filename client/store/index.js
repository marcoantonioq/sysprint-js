export const state = () => ({
  printers: [],
  spools: [],
  users: [],
});

export const mutations = {
  updatePrinters(state, payload) {
    state.printers = payload;
  },
  togglePrinters(state, payload) {
    state.printers.map((print) => {
      print.selected = false;
      return print;
    });
    payload.selected = !payload.selected;
  },
};

export const actions = {
  async nuxtServerInit(store) {
    await store.dispatch('reloadPrinters');
  },
  async reloadPrinters({ commit }, payload) {
    const { data: printers } = await this.$axios.$get('/api/printers');
    commit('updatePrinters', printers);
    return printers;
  },
};
