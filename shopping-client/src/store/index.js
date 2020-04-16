import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const type = {
  USER_INFO: "USER_INFO",
  CARTS: "CARTS"
};

const state = {
  userInfo: {},
  carts: null
};

const getters = {
  userInfo: state => {
    return state.userInfo;
  },
  carts: state => {
    return state.carts;
  }
};

const mutations = {
  [type.USER_INFO](state, userInfo) {
    if (userInfo) {
      state.userInfo = userInfo;
    } else {
      state.userInfo = null;
    }
  },
  [type.CARTS](state, carts) {
    if (carts) {
      state.carts = carts;
    } else {
      state.carts = null;
    }
  }
};

const actions = {
  setUserInfo({ commit }, userInfo) {
    commit(type.USER_INFO, userInfo);
  },
  setCarts({ commit }, carts) {
    commit(type.CARTS, carts);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          // 储存state中的carts
          carts: val.carts,
          goodsList: val.goodsList,
          selectedGoods: val.selectedGoods
        };
      }
    })
  ]
});
