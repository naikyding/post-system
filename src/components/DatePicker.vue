<script setup>
import { computed, ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { dateFormat } from '@/utils/day'

const props = defineProps(['activeDate', 'isRange'])
const emit = defineEmits(['searchList'])

// NEW =================================
const bottomSheet = ref(false)
const datePicker = ref(null)
const today = new Date()
const rangeMode = computed(() => (props.isRange ? 'range' : false))

const dates = ref([])
const formatDates = computed(() => {
  const start = dateFormat(dayjs(dates.value[0]))

  if (!rangeMode.value) {
    return dateFormat(dayjs(dates.value))
  }

  return {
    start,
    end: dateFormat(dayjs(dates.value[dates.value.length - 1])),
  }
})

// show date Picker
function showDatePicker() {
  bottomSheet.value = !bottomSheet.value
  initDates()
}

function datePickerByToday() {
  if (rangeMode.value) {
    dates.value = [today]
  } else dates.value = today
}

// 初始化日期選擇器
function initDates() {
  const activeDate = !rangeMode.value
    ? dayjs(props.activeDate).toDate()
    : { from: dayjs(props.activeDate.from).toDate(), to: dayjs(props.activeDate.to).toDate() }

  if (rangeMode.value) {
    dates.value = [activeDate.from, activeDate.to]
  } else dates.value = activeDate
}

onMounted(() => {
  initDates()
})

// NEW =================================

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
  if (!rangeMode.value) {
    return today === dates.value ? 'Today' : formatDates.value
  }

  const { start, end } = formatDates.value

  if (start === end && start === dateFormat(dayjs(today))) return 'Today'
  if (start === end) return start
  return `${start} ~ ${end}`
})

// 依設置日期取得資料
function searchData(searchDate) {
  emit('searchList', searchDate)
  bottomSheet.value = false
}
</script>

<template>
  <v-btn block variant="outlined" class="overflow-hidden text-left" @click="showDatePicker">
    <template v-slot:prepend>
      <v-icon icon="mdi-tune-variant"></v-icon>
    </template>
    <span>{{ buttonContentDisplay(today, props.activeDate) }}</span>
  </v-btn>

  <v-bottom-sheet v-model="bottomSheet">
    <v-card class="rounded-t-xl py-4">
      <div class="text-center font-italic text-grey">{{ buttonDisplayContent }}</div>

      <v-date-picker
        v-model="dates"
        :max="today"
        :multiple="rangeMode"
        ref="datePicker"
        view-mode="month"
        min-width="100vw"
        color="blue"
        borderless
        transparent
        is-dark
        hide-header
      >
      </v-date-picker>

      <div class="px-4">
        <v-btn
          @click="datePickerByToday"
          block
          class="text-none"
          color="warning"
          variant="flat"
          size="x-large"
        >
          Today
        </v-btn>

        <v-btn
          @click="searchData(formatDates)"
          block
          class="text-none my-4"
          color="success"
          variant="flat"
          size="x-large"
        >
          Search
        </v-btn>
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<style lang="scss" scoped></style>
