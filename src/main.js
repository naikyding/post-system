import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { preloadAudios } from '@/utils/audio'

import vuetify from './plugins/vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 初始化語音
preloadAudios()

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')

export default app
