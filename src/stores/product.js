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
            _id: '1',
            name: '巧克力',
            img: '',
            price: 55,
          },
          {
            _id: '2',
            name: '花生',
            img: '',
            price: 55,
          },
          {
            _id: '3',
            name: '抹茶',
            img: '',
            price: 55,
          },
          {
            _id: '4',
            name: '煉乳',
            img: '',
            price: 55,
          },
          {
            _id: '5',
            name: '奶酥',
            img: '',
            price: 55,
          },
          {
            _id: '6',
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
            _id: 'a',
            name: '巧克力',
            img: '',
            price: 60,
          },
          {
            _id: 'b',
            name: '奶油',
            img: '',
            price: 60,
          },
          {
            _id: 'c',
            name: '抹茶',
            img: '',
            price: 60,
          },
          {
            _id: 'd',
            name: '焦糖',
            img: '',
            price: 60,
          },
          {
            _id: 'e',
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
            _id: 'f',
            name: '生菜沙拉',
            img: '',
            price: 65,
          },
          {
            _id: 'g',
            name: '鮪魚玉米',
            img: '',
            price: 65,
          },
          {
            _id: 'h',
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
            _id: 'aa',
            name: '巧克力',
            img: '',
            price: 10,
          },
          {
            _id: 'bb',
            name: '花生',
            img: '',
            price: 10,
          },
          {
            _id: 'cc',
            name: '抹茶',
            img: '',
            price: 10,
          },
          {
            _id: 'dd',
            name: '煉乳',
            img: '',
            price: 10,
          },
          {
            _id: 'ee',
            name: '奶酥',
            img: '',
            price: 10,
          },
          {
            _id: 'ff',
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
            _id: 'gg',
            name: '巧克力',
            img: '',
            price: 15,
          },
          {
            _id: 'hh',
            name: '奶油',
            img: '',
            price: 15,
          },
          {
            _id: 'ii',
            name: '抹茶',
            img: '',
            price: 15,
          },
          {
            _id: 'jj',
            name: '焦糖',
            img: '',
            price: 15,
          },
          {
            _id: 'kk',
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
