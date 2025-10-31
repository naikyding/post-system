export function useTable() {
  const headers = [
    { title: '名稱', key: 'name' },
    { title: '說明', key: 'description' },
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
