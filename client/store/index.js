/**
 *  TypeScript
 *  @typedef {import("./index").state } state
 */

export const state = () => ({
  printers: [],
  spools: [],
  users: [],
});

export const mutations = {
  /**
   * Atualizar impressoras
   * @param {state} state State
   * @param {payload} payload Dados enviados
   */
  updatePrinters(state, payload) {
    try {
      payload.forEach((printer) => {
        printer.selected = false;
      });
      state.printers = payload;
    } catch (e) {}
  },
  /**
   * Alterar entre impressoras
   * @param {state} state State
   * @param {payload} payload Dados enviados
   */
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
  /**
   * Buscar lista de impressoras
   * @param {Object} param0 store
   * @param {payload} payload
   * @returns Promise
   */
  async reloadPrinters({ commit, state }, payload) {
    const { data: printers } = await this.$axios.$get('/api/printers');
    commit('updatePrinters', printers);
    return state.printers;
  },
};
