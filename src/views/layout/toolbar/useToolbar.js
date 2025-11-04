import { useUserStore } from '@/stores/users'
import { computed } from 'vue'

export function useToolbar() {
  const userStore = useUserStore()

  const userData = computed(() => userStore.baseInfo)

  return { userData, userStore }
}
