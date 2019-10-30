import {Animator} from 'aseprite-atlas'
import {AnimatorConfig} from './AnimatorConfig'

// [todo] move to aseprite-atlas?
export namespace AnimatorSerializer {
  export function serialize(animator: Readonly<Animator>): AnimatorConfig {
    const defaults = {period: 0, exposure: 0}
    if (
      animator.period === defaults.period &&
      animator.exposure === defaults.exposure
    )
      return
    const diff: Writable<AnimatorConfig> = {}
    if (animator.period !== defaults.period) diff.period = animator.period
    if (animator.exposure !== defaults.exposure)
      diff.exposure = animator.exposure
    return diff
  }
}
