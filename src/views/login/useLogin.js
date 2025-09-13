import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/users'

export function useLogin() {
  const userStore = useUserStore()
  const loginForm = ref(null)
  const form = reactive({
    // 表單狀態
    valid: false,

    email: '',
    password: '',

    // 驗証條件
    rules: {
      email: [(email) => !!email || '請輸入 email'],
      password: [(password) => (!password ? '請輸入密碼' : true)],
    },
  })

  const login = () => {
    userStore.login({
      email: form.email,
      password: form.password,
    })
  }

  return {
    userStore,
    loginForm,
    form,
    login,
  }
}
