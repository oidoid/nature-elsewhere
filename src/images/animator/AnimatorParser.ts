import {Animator} from './Animator'
import {AnimatorConfig} from './AnimatorConfig'

export namespace AnimatorParser {
  export function parse(config: AnimatorConfig): Animator {
    if (!config) return {period: 0, exposure: 0}
    return {
      period: config.period === undefined ? 0 : config.period,
      exposure: config.exposure === undefined ? 0 : config.exposure
    }
  }
}
