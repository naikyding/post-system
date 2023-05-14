import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', () => {
  const product = ref({
    // 主要口味
    flavors: [
      {
        type: '果醬',
        items: [
          {
            name: '巧克力',
            img: '',
            price: 55,
          },
          {
            name: '花生',
            img: '',
            price: 55,
          },
          {
            name: '抹茶',
            img: '',
            price: 55,
          },
          {
            name: '煉乳',
            img: '',
            price: 55,
          },
          {
            name: '奶酥',
            img: '',
            price: 55,
          },
          {
            name: '蜂蜜',
            img: '',
            price: 55,
          },
        ],
      },
      {
        type: '卡士達',
        items: [
          {
            name: '巧克力',
            img: '',
            price: 60,
          },
          {
            name: '奶油',
            img: '',
            price: 60,
          },
          {
            name: '抹茶',
            img: '',
            price: 60,
          },
          {
            name: '焦糖',
            img: '',
            price: 60,
          },
          {
            name: 'Oreo 巧克力',
            img: '',
            price: 60,
          },
        ],
      },
      {
        type: '生菜',
        items: [
          {
            name: '生菜沙拉',
            img: '',
            price: 65,
          },
          {
            name: '鮪魚玉米',
            img: '',
            price: 65,
          },
          {
            name: '舒肥雞胸',
            img: '',
            price: 70,
          },
        ],
      },
    ],
    // 加料
    extras: [
      {
        type: '果醬',
        items: [
          {
            name: '巧克力',
            img: '',
            price: 10,
          },
          {
            name: '花生',
            img: '',
            price: 10,
          },
          {
            name: '抹茶',
            img: '',
            price: 10,
          },
          {
            name: '煉乳',
            img: '',
            price: 10,
          },
          {
            name: '奶酥',
            img: '',
            price: 10,
          },
          {
            name: '蜂蜜',
            img: '',
            price: 10,
          },
        ],
      },
      {
        type: '卡士達',
        items: [
          {
            name: '巧克力',
            img: '',
            price: 15,
          },
          {
            name: '奶油',
            img: '',
            price: 15,
          },
          {
            name: '抹茶',
            img: '',
            price: 15,
          },
          {
            name: '焦糖',
            img: '',
            price: 15,
          },
          {
            name: 'Oreo 巧克力',
            img: '',
            price: 15,
          },
        ],
      },
    ],
  })

  const orderItems = ref([])

  // 口味種類
  const tabs = computed(() => {
    return product.value.flavors.map((item) => item.type)
  })

  const tabsContent = computed(() => {
    return product.value.flavors.reduce(
      (acc, cur) => {
        acc['tabs'] = [...acc['tabs'], cur.type]
        acc['content'] = [...acc['content'], cur.items]
        return acc
      },
      { tabs: [], content: [] },
    )
  })

  return { product, tabs, tabsContent, orderItems }
})
