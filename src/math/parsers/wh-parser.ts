import {WH} from '../wh'
import {WHConfig} from './wh-config'

export namespace WHParser {
  export function parse(config: WHConfig): WH {
    if (!config) return {w: 0, h: 0}
    return {
      w: config.w === undefined ? 0 : config.w,
      h: config.h === undefined ? 0 : config.h
    }
  }
}
