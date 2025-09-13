import { ref } from 'vue'
import monsterLogo from '@/assets/images/ci/monster-crepes-ci.jpeg'
import { useUserStore } from '../../stores/users'
import { useSystemOrderList } from '@/stores/orders'
import { watch } from 'vue'
import router from '../../router'

const systemOrderStore = useSystemOrderList()
systemOrderStore.getOrderList('getPendingQuantity')

const userStore = useUserStore()
const state = ref({
  drawer: true,
  items: [
    // { title: 'Home', icon: 'mdi-home-city' },
    // { title: 'My Account', icon: 'mdi-account' },
    // { title: 'Users', icon: 'mdi-account-group-outline' },
  ],
  rail: true,
})

const passwordForm = ref(null)
const dialog = ref(false)
const passwordInput = ref('')
const rules = ref({
  password: [(password) => !!password || '密碼必填'],
})

watch(dialog, (status) => {
  if (!status) resetForm()
})

function goDashboard() {
  dialog.value = true
  // to="/dashboard"
}

function sidebarClose() {
  if (state.value.rail) return false
  state.value.rail = true
}

async function dialogSubmit() {
  const check = await validateForm()
  if (!check) return false
  dialog.value = false
  const res = await userStore.checkPassword({
    email: userStore.baseInfo.email,
    password: passwordInput.value,
  })
  if (res) router.push('/dashboard')
}

function dialogCancel() {
  dialog.value = false
}

async function validateForm() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return false
  return true
}

function resetForm() {
  passwordForm.value.reset()
}

export function useLayout() {
  return {
    state,
    rules,
    goDashboard,
    sidebarClose,
    dialogCancel,
    dialogSubmit,
    dialog,
    systemOrderStore,
    passwordInput,
    passwordForm,
  }
}
