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
    required: (v) => !!v || '必填項目',
  })

  return { validate, reset, rules }
}
