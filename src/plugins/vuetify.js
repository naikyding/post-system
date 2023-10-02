// Vuetify icons
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'

const vuetify = createVuetify({
  components: {
    ...components,
    VDatePicker,
    VBottomSheet,
  },
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
          black: '#2e2e2e',
        },
      },
      light: {},
    },
  },
})

export default vuetify
