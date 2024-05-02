const synth = speechSynthesis

export const speak = (content) => {
  if (!content || synth.speaking) return false

  let utterance = new SpeechSynthesisUtterance(content)
  return synth.speak(utterance)
}
