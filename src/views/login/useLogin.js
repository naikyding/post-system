import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/users'
import router from '@/router'
import Swal from 'sweetalert2'

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

  const login = async () => {
    const loginSuccess = await userStore.login({
      email: form.email,
      password: form.password,
    })

    if (loginSuccess) {
      Swal.fire({
        icon: 'success',
        title: '登入成功',
        width: '400px',
        timer: 1500,
        showConfirmButton: false,
      })
      router.push('/roles')
    }
  }

  return {
    userStore,
    loginForm,
    form,
    login,
  }
}
