export interface Synth {
  readonly context: AudioContext
  oscillator?: OscillatorNode
  gain?: GainNode
}
type t = Synth

export namespace Synth {
  export const make = (): t => ({context: new AudioContext()})

  export const play = (
    val: t,
    type: OscillatorType,
    startFrequency: number,
    endFrequency: number,
    duration: number
  ): t => {
    const oscillator = val.context.createOscillator()
    const gain = val.context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(startFrequency, val.context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      val.context.currentTime + duration
    )

    gain.gain.setValueAtTime(1, val.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      val.context.currentTime + duration
    )

    oscillator.connect(gain)
    gain.connect(val.context.destination)

    oscillator.start()
    oscillator.stop(val.context.currentTime + duration)
    return {...val, oscillator, gain}
  }
}
