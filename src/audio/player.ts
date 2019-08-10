export interface Player {
  readonly context: AudioContext
  oscillator?: OscillatorNode
  gain?: GainNode
}

export namespace Player {
  export function make(): Player {
    return {context: new AudioContext()}
  }

  export function play(
    state: Player,
    type: OscillatorType,
    startFrequency: number,
    endFrequency: number,
    duration: number
  ): Player {
    const oscillator = state.context.createOscillator()
    const gain = state.context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(
      startFrequency,
      state.context.currentTime
    )
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      state.context.currentTime + duration
    )

    gain.gain.setValueAtTime(1, state.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      state.context.currentTime + duration
    )

    oscillator.connect(gain)
    gain.connect(state.context.destination)

    oscillator.start()
    oscillator.stop(state.context.currentTime + duration)
    return {...state, oscillator, gain}
  }
}