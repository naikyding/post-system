import { useMenusStore } from '@/stores/menus'
import { onMounted } from 'vue'
const menuStore = useMenusStore()

export function useMenus() {
  onMounted(() => {
    menuStore.getMenusAndOperations()
  })

  return {
    menuStore,
  }
}
