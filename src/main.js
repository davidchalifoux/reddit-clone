import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { firestorePlugin } from 'vuefire'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  firestorePlugin,
  render: h => h(App)
}).$mount('#app')
