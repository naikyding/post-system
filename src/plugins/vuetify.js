// Vuetify icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  // ICON
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },

  // THEME
  theme: {
    defaultTheme: 'dark',
    themes: {
      // custom themes https://vuetifyjs.com/en/features/theme/#changing-theme
      dark: {
        colors: {
          primary: '#BFA473',
        },
      },
      light: {},
    },
  },
})

export default vuetify
