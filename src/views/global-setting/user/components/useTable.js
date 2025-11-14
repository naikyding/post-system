import { useUserStore } from '@/stores/users'

export function useTable() {
  const userStore = useUserStore()
  const headers = [
    { title: '綽號', key: 'nickname' },
    { title: 'email', key: 'email' },
    { title: '商家 / 角色', key: 'agentRoles' },
    { title: '創建時間', key: 'createdAt' },
    { title: '操作', key: 'actions', align: 'center' },
  ]

  const getRoles = (agentRoles, agentId) => {
    return agentRoles.find((item) => item.agent._id === agentId)?.roles || []
  }

  const getAgents = (agentRoles) => {
    return agentRoles.map((item) => item.agent)
  }

  return {
    getRoles,
    headers,
    getAgents,
  }
}
