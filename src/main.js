import Vue from 'vue';
import VueRouter from "vue-router";
import App from './App.vue';
import { routes } from "./routes";
import { store } from "./store/store";
import VueResource from "vue-resource";

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
	routes,
	mode: "history"
});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
