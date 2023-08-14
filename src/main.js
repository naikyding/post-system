import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'

const app = createApp(App)

app.component('VueDatePicker', VueDatePicker)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')

export default app
