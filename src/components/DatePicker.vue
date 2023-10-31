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
    <span> 2023-10-31 ~ 2023-10-31 </span>
  </v-btn>

  <v-bottom-sheet v-model="bottomSheet">
    {{ datePickerConfig.range }}
    <v-card class="rounded-t-lg">
      <VDatePicker
        v-model.string="datePickerConfig.range"
        is-range
        borderless
        transparent
        title-position="left"
        expanded
        is-dark
        :attributes="datePickerConfig.attributes"
        :masks="datePickerConfig.masks"
      >
        <template #footer>
          <div class="px-4">
            <v-btn block class="text-none mb-4" color="success" size="x-large" variant="flat">
              OK
            </v-btn>

            <v-btn block class="text-none mb-4" color="error" size="x-large" variant="flat">
              CANCEL
            </v-btn>
          </div>
        </template>
      </VDatePicker>
    </v-card>
  </v-bottom-sheet>
</template>

<style lang="scss" scoped></style>
