import { useSystemOrderList } from '@/stores/orders'

export function useOrderStatus() {
  const systemOrderStore = useSystemOrderList()

  systemOrderStore.getOrderList('today')
  systemOrderStore.getOrderList('today', 'readyForPickup')

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
