import {Animator} from 'aseprite-atlas'
import {AnimatorConfig} from './AnimatorConfig'

export namespace AnimatorParser {
  export function parse(config: AnimatorConfig): Animator {
    return {period: config?.period ?? 0, exposure: config?.exposure ?? 0}
  }
}
