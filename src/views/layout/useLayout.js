import { computed, ref } from 'vue'
import monsterLogo from '@/assets/images/ci/monster-crepes-ci.jpeg'
import { useUserStore } from '../../stores/users'
import { useSystemOrderList } from '@/stores/orders'
import { watch } from 'vue'
import router from '../../router'
import { useRouterStore } from '@/stores/router'

export function useLayout() {
  const routerStore = useRouterStore()

  function normalizePaths(routes) {
    return routes.map((route) => {
      const newRoute = { ...route }

      // 確保 path 前面有 "/"
      if (newRoute.path && !newRoute.path.startsWith('/')) {
        newRoute.path = '/' + newRoute.path
      }

      // 遞迴處理 children
      if (Array.isArray(newRoute.children) && newRoute.children.length > 0) {
        newRoute.children = normalizePaths(newRoute.children)
      }

      return newRoute
    })
  }

  const transformMenus = computed(() => {
    return normalizePaths(routerStore.routes)
  })

  const systemOrderStore = useSystemOrderList()
  systemOrderStore.getOrderList('getPendingQuantity')

  const userStore = useUserStore()
  const state = ref({
    drawer: true,
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

  return {
    transformMenus,
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
    userStore,
  }
}
