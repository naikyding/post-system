import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify'

// 日期選擇器 https://vcalendar.io/
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)

// app.component('VueDatePicker', VueDatePicker)

app.use(VCalendar, {})
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')

export default app
