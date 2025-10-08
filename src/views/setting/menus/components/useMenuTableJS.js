import { computed, onMounted, ref } from 'vue'

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

  const formatMenus = computed(() => {
    props.menus.forEach((item) => initOpenChildren(item, openChildrenId))
    return props.menus
  })

  function initOpenChildren(node, openChildrenId) {
    // 如果有 operations → 初始化
    if (node.operations?.length) {
      node.operations.forEach((op) => {
        openChildrenId.value[op._id] = false
      })
    }

    // 如果有 children → 初始化自己 + 遞迴子層
    if (node.children?.length) {
      openChildrenId.value[node._id] = false
      node.children.forEach((child) => initOpenChildren(child, openChildrenId))
    }
  }

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

  onMounted(() => {
    //
  })

  return { headers, formatMenus, search, openChildrenId, filterItem, getColor }
}
