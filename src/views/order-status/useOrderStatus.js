import { useSystemOrderList } from '@/stores/orders'
import { onBeforeUnmount } from 'vue'

export function useOrderStatus() {
  const systemOrderStore = useSystemOrderList()

  systemOrderStore.getOrderList('today')
  systemOrderStore.getOrderList('today', 'readyForPickup')

  function datePickerEvent(searchDate) {
    systemOrderStore.activeListDate.from = searchDate
    systemOrderStore.activeListDate.to = searchDate

    systemOrderStore.getOrderList()
  }

  onBeforeUnmount(() => {
    systemOrderStore.activeListTab = 'pending'
  })

  return {
    datePickerEvent,
    systemOrderStore,
  }
}
