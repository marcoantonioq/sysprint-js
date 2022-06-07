export const state = () => ({
  printers: [],
  FILES_FORMATS: ['application/pdf', 'text/plain'],
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
  toggle(state, payload) {
    payload.selected = !payload.selected;
  },
};

export const actions = {
  async nuxtServerInit(store) {
    const token = this.$cookies.get('token');
    if (token) {
      try {
        const { data } = await this.$axios.$get('/api/users/user');
        await store.commit('auth/SET_TOKEN', token);
        await store.commit('auth/SET_USER', data.user);
      } catch (e) {
        await store.commit('auth/LOGOUT');
      }
    } else {
      await store.commit('auth/LOGOUT');
    }
  },
  update({ commit }, payload) {
    this.$axios.$get('/api/printers').then((printers) => {
      commit('updatePrinters', printers.printers);
    });
    commit('update', payload);
  },
  remove({ commit }, payload) {
    commit('remove', payload);
  },
  toggle({ commit }, payload) {
    commit('toggle', payload);
  },
  print({ commit, dispatch }, form) {
    this.$axios.$post('/api/print', form);
  },
};
