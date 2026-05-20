const audioMap = {}

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

export const speakMobile = async (mobile) => {
  const numbers = mobile.slice(-3).split('')

  await playAudio('prefix')

  for (const number of numbers) {
    await playAudio(number)
  }

  await playAudio('suffix')
}
