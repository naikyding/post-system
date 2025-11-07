import { useUserStore } from '@/stores/users'
import { computed, ref, watch } from 'vue'
import { validatePasswordType2 } from '@/utils/validate'
import { updateUserPasswordAPI } from '@/api'
import catchAsync from '../../utils/catchAsync'

export const useProfile = ({ passwordFormRef, ConfirmDialogRef }) => {
  const userStore = useUserStore()

  const user = computed(() => userStore.baseInfo)
  const userRoles = computed(() => userStore.activeAgentData?.roles || [])

  const cardKey = ref(0)
  const activeRoleId = ref(null)
  const formDialogStatus = ref(false)

  function cancelDialog() {
    activeRoleId.value = null
    cardKey.value++
    ConfirmDialogRef.value.status = false
  }
  async function saveDialog() {
    await localStorage.setItem('activeRoleId', activeRoleId.value)
    userStore.activeRoleId = localStorage.getItem('activeRoleId')
    cardKey.value++
    ConfirmDialogRef.value.status = false
  }

  function showConfirmDialog(id) {
    if (userStore.activeRoleId === id) return false

    activeRoleId.value = id
    ConfirmDialogRef.value.status = true
  }

  const initForm = () => ({
    oldPassword: '',
    newPassword: '',
  })

  const form = ref(initForm())
  const formRules = {
    required: (value) => !!value || '請輸入密碼',
    format: (password) =>
      validatePasswordType2(password) ||
      '密碼至少 8 碼，且至少一個英文字母 (大小寫皆可)、一個特殊符號。',
  }

  watch(
    () => formDialogStatus.value,
    (newStatus, oldStatus) => {
      if (!newStatus === oldStatus) {
        form.value = initForm()
      }
    },
  )

  function openResetPasswordDialog() {
    formDialogStatus.value = true
  }

  function cancelResetPassword() {
    console.log('CANCEL')
    resetResetPassword()
    formDialogStatus.value = false
  }

  function resetResetPassword() {
    console.log('RESET')
    passwordFormRef.value.reset()
  }

  const resetPasswordSubmit = catchAsync(async () => {
    const userId = userStore.baseInfo._id
    const { valid } = await passwordFormRef.value.validate()

    if (!valid) return false
    const { status } = await updateUserPasswordAPI(userId, form.value)
    if (status) {
      cancelResetPassword()
    }
  })

  return {
    user,
    userRoles,
    cancelDialog,
    saveDialog,
    showConfirmDialog,
    userStore,
    form,
    cardKey,
    formRules,
    openResetPasswordDialog,
    formDialogStatus,
    cancelResetPassword,
    resetPasswordSubmit,
    resetResetPassword,
  }
}
