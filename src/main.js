import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import '@/assets/styles/main.css'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Hydrate auth before the router is installed at all — installing it starts
// vue-router's initial navigation (and the requiresAuth guard) immediately,
// racing this async call rather than waiting for it.
useAuthStore(pinia)
  .hydrate()
  .finally(() => {
    app.use(router)
    app.mount('#app')
  })
