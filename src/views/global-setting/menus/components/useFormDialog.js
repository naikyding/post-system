import { ref } from 'vue'

export function useOperationFormDialog(formRef) {
  async function validate() {
    const { valid } = await formRef.value.validate()
    return valid
  }

  function reset() {
    formRef.value.reset()
  }

  const rules = ref({
    required: (v) => (v !== null && v !== undefined && String(v) !== '') || '必填項目',
    isNumber: (num) => !isNaN(Number(num)) || '必須為數字格式',
  })

  return { validate, reset, rules }
}
