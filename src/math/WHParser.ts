import {WH} from './WH'

export type WHConfig = Maybe<Partial<WH>>

export namespace WHParser {
  export function parse(config: WHConfig): WH {
    const w = config && config.w !== undefined ? config.w : 0
    const h = config && config.h !== undefined ? config.h : 0
    return {w, h}
  }
}
