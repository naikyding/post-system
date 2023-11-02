<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { dateFormat } from '@/utils/day'

const props = defineProps(['activeDate', 'isRange'])
const emit = defineEmits(['searchList'])

// 動態修飾符
const modifiers = computed(() => ({
  range: props.isRange || false,
  string: true,
}))

console.log(props)

const bottomSheet = ref(false)
const datePicker = ref(null)
const today = dateFormat(dayjs())
const datePickerConfig = ref({
  // 組件內容設置
  attributes: [
    // 標記今天
    {
      content: {
        style: {
          color: 'lightgreen',
          fontStyle: 'italic',
        },
      },
      dates: today,
    },
  ],

  // 日期選擇
  date: props.isRange ? { start: today, end: today } : today,

  // 日期選擇格式
  masks: {
    modelValue: 'YYYY-MM-DD',
  },

  // 禁用日期
  disabledDates: [{ start: dateFormat(dayjs().add(1, 'day')), end: null }],
})

function buttonContentDisplay(today, currentDate) {
  if (props.isRange) {
    const { from, to } = currentDate
    if (from === to && from === today) return 'Today'
    return `${from} ~ ${to}`
  }
  if (currentDate === today) return 'Today'
  else return currentDate
}

const buttonDisplayContent = computed(() => {
  if (props.isRange) {
    const { start, end } = datePickerConfig.value.date
    if (datePickerConfig.value.date === today || (start === end && start === today)) return 'Today'
    return `${start} ~ ${end}`
  }

  if (datePickerConfig.value.date === today) return 'Today'
  else return datePickerConfig.value.date
})

// 日期設置今日
function selectToday(datePickerConfig) {
  if (props.isRange) {
    datePickerConfig.date = {
      start: today,
      end: today,
    }
  } else datePickerConfig.date = today

  datePicker.value.move(today)
}

// 依設置日期取得資料
function searchData(searchDate) {
  emit('searchList', searchDate)
  bottomSheet.value = false
}
</script>

<template>
  <v-btn
    block
    variant="outlined"
    class="overflow-hidden text-left"
    @click="bottomSheet = !bottomSheet"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi-tune-variant"></v-icon>
    </template>
    <span>{{ buttonContentDisplay(today, props.activeDate) }}</span>
  </v-btn>

  <v-bottom-sheet v-model="bottomSheet">
    <v-card class="rounded-t-xl py-4">
      <div class="text-center font-italic text-grey">{{ buttonDisplayContent }}</div>
      <VDatePicker
        v-model="datePickerConfig.date"
        :model-modifiers="modifiers"
        :attributes="datePickerConfig.attributes"
        :masks="datePickerConfig.masks"
        :disabled-dates="datePickerConfig.disabledDates"
        ref="datePicker"
        mode="date"
        borderless
        transparent
        expanded
        is-dark
      >
        <template #footer>
          <div class="px-4">
            <v-btn
              @click="selectToday(datePickerConfig)"
              block
              class="text-none mb-4"
              color="warning"
              size="x-large"
              variant="flat"
            >
              Today
            </v-btn>

            <v-btn
              @click="searchData(datePickerConfig.date)"
              block
              class="text-none mb-4"
              color="success"
              size="x-large"
              variant="flat"
            >
              Search
            </v-btn>
          </div>
        </template>
      </VDatePicker>
    </v-card>
  </v-bottom-sheet>
</template>

<style lang="scss" scoped></style>
