import { useSystemOrderList } from '@/stores/orders'

export function useOrderStatus() {
  console.log('useOrderStatus')
  const systemOrderStore = useSystemOrderList()

  systemOrderStore.getOrderList('today')

  function datePickerEvent(searchDate) {
    systemOrderStore.activeListDate.from = searchDate
    systemOrderStore.activeListDate.to = searchDate

    systemOrderStore.getOrderList()
  }

  return {
    datePickerEvent,
    systemOrderStore,
  }
}
