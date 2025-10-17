export function useTable() {
  const headers = [
    { title: '綽號', key: 'nickname' },
    { title: 'email', key: 'email' },
    { title: '角色', key: 'agentRoles' },
    { title: '創建時間', key: 'createdAt' },
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
