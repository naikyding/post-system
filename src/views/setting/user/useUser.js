import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export function useUser() {
  const userStore = useUserStore()
  const userList = computed(() => userStore.list)

  onMounted(() => {
    userStore.getUserList()
  })

  return { userList }
}
