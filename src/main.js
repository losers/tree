import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VueParticles from 'vue-particles';
import axios from "axios";
import 'typeface-comfortaa'
import device from "vue-device-detector"

Vue.use(device)

Vue.use(VueParticles)
Vue.config.productionTip = false
axios.defaults.withCredentials = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')