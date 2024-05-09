<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useExtrasStore } from '@/stores/extras'

const extrasStore = useExtrasStore()
const productsStore = useProductsStore()
const search = ref('')

const active = ref({
  index: 0,
  items: [
    {
      tabName: '商品',
      list: computed(() => formatProductList(productsStore.products)),
      getList: getProductsList,
    },
    {
      tabName: '配料',
      list: computed(() => extrasStore.extras),
      getList: getExtrasList,
    },
  ],
})

function formatProductList(list) {
  return list.reduce((acc, cur) => {
    return (acc = [...acc, ...cur.items])
  }, [])
}

const table = ref({
  headers: [
    { title: '類型', key: 'type' },
    { title: '名稱', key: 'name' },
    { title: '說明', key: 'description' },
    { title: '價錢', key: 'price', align: 'end', value: (item) => `$${item.price}` },
    { title: 'Actions', key: 'actions', align: 'center' },
  ],
})

watch(
  () => active.value.index,
  (status) => {
    search.value = ''
    active.value.items[status]['getList']()
  },
)

function getExtrasList() {
  extrasStore.getExtrasList()
}

function getProductsList() {
  productsStore.getProducts()
}

getProductsList()
</script>

<template>
  <div class="">
    <v-sheet class="mx-4 mb-4">
      <v-slide-group v-model="active.index">
        <v-slide-group-item
          v-for="(item, index) in active.items"
          :key="index"
          v-slot="{ isSelected, toggle }"
        >
          <v-btn
            size="x-large"
            class="my-2"
            @click="toggle"
            :color="isSelected ? 'primary' : undefined"
            :variant="isSelected ? 'tonal' : 'text'"
          >
            {{ item.tabName }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>

      <v-row class="mt-1">
        <v-col cols="12" sm="6" class="py-1">
          <!-- 搜尋 input -->
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="py-1">
          <v-btn block size="x-large" color="success">ADD</v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <!-- {{ active.items[active.index] }} -->
    <v-expand-transition class="content-height">
      <v-data-table
        :headers="table.headers"
        :items="active.items[active.index]['list']"
        :mobile="false"
        :search="search"
        fixed-header
        items-per-page="-1"
      >
        <template v-slot:item.actions="{ item }">
          <!-- 修改 -->
          <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
        </template>
      </v-data-table>
    </v-expand-transition>
  </div>
</template>

<style lang="scss" scoped>
.content-height {
  height: calc(100dvh - 152px);
}
</style>
