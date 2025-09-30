import { computed, ref } from 'vue'

export function useMenuTable(props) {
  const search = ref('')
  const headers = [
    {
      title: '選單名稱',
      key: 'name',
    },
    {
      title: '路由名稱',
      key: 'routeName',
    },
    {
      title: '路由路徑',
      key: 'path',
    },
    {
      title: '組件路徑',
      key: 'component',
    },
    {
      title: '操作',
      align: 'center',
    },
  ]

  const openChildrenId = ref({})

  const formatMenus = computed(() =>
    props.menus.map((item) => {
      if (item.children && item.children.length > 0) {
        openChildrenId.value[item._id] = false
        item.children.map((menuChildren) => {
          if (menuChildren.operations && menuChildren.operations.length > 0) {
            openChildrenId.value[menuChildren._id] = false
          }
        })
      }

      return item
    }),
  )

  const getColor = (action) => {
    const colors = {
      create: 'success',
      delete: 'error',
      update: 'warning',
      read: 'greed',
    }

    return colors[action] || colors['create']
  }

  const filterItem = (parent, id) => parent.filter((item) => item._id === id)

  return { headers, formatMenus, search, openChildrenId, filterItem, getColor }
}
