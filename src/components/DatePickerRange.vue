<script setup>
import { ref } from 'vue'

const bottomSheet = ref(false)

const datePickerConfig = ref({
  // 組件內容設置
  attributes: [
    // 標記今天
    {
      key: 'today',
      highlight: {
        fillMode: 'outline',
      },
      dates: new Date(),
    },
  ],

  // 日期選擇
  range: {
    start: null,
    end: null,
  },

  // 日期選擇格式
  masks: {
    modelValue: 'YYYY-MM-DD',
  },
})

function cleanRangeDate(datePickerConfig) {
  datePickerConfig.range = null
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
    <span> {{ datePickerConfig.range?.start }} </span>
    <span v-show="datePickerConfig.range?.end"> ~ </span>
    <span> {{ datePickerConfig.range?.end }} </span>
  </v-btn>

  <v-bottom-sheet v-model="bottomSheet">
    <v-card class="rounded-t-lg">
      <div>
        <span> {{ datePickerConfig.range?.start }} </span>
        <span v-show="datePickerConfig.range?.end"> ~ </span>
        <span> {{ datePickerConfig.range?.end }} </span>
      </div>
      <VDatePicker
        v-model.range.string="datePickerConfig.range"
        mode="date"
        :attributes="datePickerConfig.attributes"
        :masks="datePickerConfig.masks"
        borderless
        transparent
        expanded
        is-dark
      >
        <template #footer>
          <div class="px-4">
            <v-btn
              @click="cleanRangeDate(datePickerConfig)"
              block
              class="text-none mb-4"
              color="warning"
              size="x-large"
              variant="flat"
            >
              CLEAN
            </v-btn>

            <v-btn block class="text-none mb-4" color="success" size="x-large" variant="flat">
              OK
            </v-btn>
          </div>
        </template>
      </VDatePicker>
    </v-card>
  </v-bottom-sheet>
</template>

<style lang="scss" scoped></style>
