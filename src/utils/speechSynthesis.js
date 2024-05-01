const synth = speechSynthesis

export const speak = (text) => {
  if (!text) return false
  if (synth.speaking) return false

  let utterance = new SpeechSynthesisUtterance(text)
  return synth.speak(utterance)
}
