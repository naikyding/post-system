export function useTable() {
  const headers = [
    { title: '排序', key: 'sort' },
    { title: '名稱', key: 'name' },
    { title: '狀態', key: 'status' },
    { title: '預設', key: 'isDefault' },
    { title: '操作', key: 'actions', align: 'center' },
  ]

  const getRoles = (agentRoles) => {
    return agentRoles[0]['roles']
  }

  return {
    getRoles,
    headers,
  }
}
