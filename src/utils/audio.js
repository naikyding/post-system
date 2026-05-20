const audioMap = {}
let isPlaying = false

/**
 * preload audio
 */
export const preloadAudios = () => {
  const files = ['prefix', 'suffix', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  files.forEach((name) => {
    const audio = new Audio(`/audio/${name}.mp3`)

    audio.preload = 'auto'
    audio.volume = 1

    audio.load()

    audioMap[name] = audio
  })
}

export const playAudio = (name) => {
  return new Promise((resolve, reject) => {
    const originalAudio = audioMap[name]

    // clone 很重要
    const audio = originalAudio.cloneNode()

    audio.onended = resolve

    audio.onerror = reject

    audio.play()
  })
}

/**
 * 播放叫號
 */
export const speakMobile = async (mobile) => {
  // 已播放中
  if (isPlaying) return

  isPlaying = true

  try {
    const numbers = mobile.slice(-3).split('')

    // 開頭
    await playAudio('prefix')

    // 數字
    for (const number of numbers) {
      await playAudio(number)
    }

    // 結尾
    await playAudio('suffix')
  } catch (error) {
    console.error(error)
  } finally {
    isPlaying = false
  }
}
