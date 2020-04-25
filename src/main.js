import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(router);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false
Vue.use(require('vue-script2'))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// var through = require('through2')
// // This will replace <script> with <script2> in .html, .vue and .ejs files
// // EXCEPT:
// // - within <!-- comments -->
// // - top-level <script> tags within .vue files
// // Additional exclusion per: http://www.rexegg.com/regex-best-trick.html
// // Excluding <pre> tags did not seem to work, however.
// function script2ify(file) {
//   return !/\.(vue|html|ejs)$/.test(file) // edit to support other file types
//     ? through()
//     : through(function (buf, encoding, cb) {
//       // avoid replacing top-level <script> tags in .vue files
//       var regex = /\.vue$/.test(file)
//         ? /<!--.*?-->|^<script>|^<\/script>|(?:<(\/)?script([ >]))/gm
//         : /<!--.*?-->|(?:<(\/)?script([ >]))/gm
//       var replacement = (m, p1, p2) => p2 ? `<${p1 || ''}script2${p2}` : m
//       cb(null, buf.toString('utf8').replace(regex, replacement))
//     })
// }