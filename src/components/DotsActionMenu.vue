<script setup>
const props = defineProps({
  // 項目
  items: {
    type: Array,
    default: () => {
      return []
    },
  },
  // 若有多個 btn，給予唯一值
  id: {
    type: String,
    default: '123',
  },
  // context 資料
  data: {
    type: Object,
  },
})

// 項目之間加上 divider
function formatItems(items) {
  const divider = { type: 'divider' }
  const itemsLength = items.length

  return items.reduce((acc, cur, curIndex) => {
    if (cur.type !== 'divider') {
      acc.push(cur)
      if (curIndex + 1 !== itemsLength) {
        acc.push(divider)
      }
    }
    return acc
  }, [])
}

function event({ model, itemData, event }) {
  if (typeof event === 'function') {
    event({ model, itemData })
  }
}
</script>

<template>
  <div>
    <v-btn
      icon="mdi-dots-vertical"
      size="x-small"
      variant="outlined"
      :id="`menu-activator-${props.id}`"
    >
    </v-btn>
    <v-menu :activator="`#menu-activator-${props.id}`">
      <v-list class="py-0" density="compact" slim>
        <template v-for="menuItem in formatItems(props.items)" :key="menuItem.type">
          <v-divider v-if="menuItem.type === 'divider'" />
          <v-list-item
            v-else
            @click="event({ model: menuItem.code, itemData: props.data, event: menuItem.event })"
          >
            <v-list-item-title>
              <span class="text-subtitle-2">{{ menuItem.title }} </span>
            </v-list-item-title>
            <template v-slot:prepend>
              <v-icon size="small" :icon="menuItem.icon"></v-icon>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>
