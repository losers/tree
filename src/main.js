import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VueParticles from 'vue-particles';
import axios from "axios";
import 'typeface-comfortaa'
import device from "vue-device-detector"
import VModal from "vue-js-modal";

Vue.use(VueParticles)
Vue.use(device)
Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});


Vue.config.productionTip = false
axios.defaults.withCredentials = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')