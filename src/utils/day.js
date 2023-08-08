import dayJs from 'dayjs'

export const dateFormat = (dayString) => {
  return dayJs(dayString).format('YYYY-MM-DD')
}
