import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import VueSocketIO from "vue-socket.io";
import Distpicker from "v-distpicker";

Vue.component("v-distpicker", Distpicker);

import { Message } from "element-ui";

Vue.config.productionTip = false;
// axios.defaults.baseURL = "https://eleapi.smacricketcvm.com/";
axios.defaults.timeout = 30000;
Vue.prototype.$axios = axios;

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    if (["/user/login", "/user/register"].indexOf(config.url) === -1) {
      // 判断token是否存在
      if (localStorage.loginToken) {
        //将token设置成请求头
        config.headers.token = localStorage.loginToken;
      }
    }
    // console.log(config);
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
axios.interceptors.response.use(
  (res) => {
    if (res.data.code === 1005) {
      router.replace("/login");
      Message.error(res.data.msg);
    }
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);

Vue.use(ElementUI);

// socket
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:8888",
    vuex: {},
  })
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
