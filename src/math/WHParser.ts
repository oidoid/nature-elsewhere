import {WH} from './WH'
import {WHConfig} from './WHConfig'

export namespace WHParser {
  export function parse(config: WHConfig): WH {
    return new WH(config?.w ?? 0, config?.h ?? 0)
  }
}
