import { createStore } from "vuex";

export default createStore({
  state: {
    hostIP: "",
  },
  actions: {

  },

  mutations: {
    insertHostIP(state, post) {
      state.hostIP = post;
    },
  },

  getters: {
    getHostIP(state) {
      return state.hostIP;
    },
  },
});
